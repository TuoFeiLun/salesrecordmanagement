const mongoose = require('mongoose');

// Helper function to validate date format
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

// Helper function to validate price format
const isValidPrice = (price) => {
    return !isNaN(price) && parseFloat(price) >= 0;
};

// Helper function to build query conditions

///api/salesrecord?startDate=2024-03-1&endDate=2024-04-01&sortBy=transactionprice&sortOrder=asc

// // 组合查询：特定品牌的汽车，特定价格范围
// GET /api/salesrecords?carBrand=benz1&minPrice=20000&maxPrice=30000

// // 组合查询：特定买家，特定日期范围
// GET /api/salesrecords?buyerName=alenjimmy&startDate=2024-01-01&endDate=2024-12-31

// // 组合查询：特定销售员，特定价格范围
// GET /api/salesrecords?salesman=John&minPrice=20000
// 只按汽车品牌查询
// GET /api/salesrecords?carBrand=benz1

// // 只按买家名字查询
// GET /api/salesrecords?buyerName=alenjimmy

// // 只按销售员查询
// GET /api/salesrecords?salesman=John
const buildQueryConditions = (query) => {
    const conditions = {};
    const errors = [];

    // Filter by car brand
    if (query.carBrand) {
        if (typeof query.carBrand !== 'string' || query.carBrand.trim().length === 0) {
            errors.push('Invalid car brand format');
        } else {
            conditions['car.brandname'] = { $regex: query.carBrand, $options: 'i' };
        }
    }

    // Filter by buyer name
    if (query.buyerName) {
        if (typeof query.buyerName !== 'string' || query.buyerName.trim().length === 0) {
            errors.push('Invalid buyer name format');
        } else {
            conditions['buyer.firstname'] = { $regex: query.buyerName, $options: 'i' };
        }
    }

    // Filter by salesman
    if (query.salesman) {
        if (typeof query.salesman !== 'string' || query.salesman.trim().length === 0) {
            errors.push('Invalid salesman format');
        } else {
            conditions.salesman = { $regex: query.salesman, $options: 'i' };
        }
    }

    // Filter by date range
    if (query.startDate || query.endDate) {
        conditions.purchasedate = {};
        if (query.startDate) {
            if (!isValidDate(query.startDate)) {
                errors.push('Invalid start date format');
            } else {
                conditions.purchasedate.$gte = new Date(query.startDate);
            }
        }
        if (query.endDate) {
            if (!isValidDate(query.endDate)) {
                errors.push('Invalid end date format');
            } else {
                conditions.purchasedate.$lte = new Date(query.endDate);
            }
        }
    }

    // Filter by price range
    if (query.minPrice || query.maxPrice) {
        conditions.transactionprice = {};
        if (query.minPrice) {
            if (!isValidPrice(query.minPrice)) {
                errors.push('Invalid minimum price format');
            } else {
                conditions.transactionprice.$gte = parseFloat(query.minPrice);
            }
        }
        if (query.maxPrice) {
            if (!isValidPrice(query.maxPrice)) {
                errors.push('Invalid maximum price format');
            } else {
                conditions.transactionprice.$lte = parseFloat(query.maxPrice);
            }
        }
    }

    return { conditions, errors };
};

// Helper function to build sort options

// GET /api/salesrecords?sortBy=price&sortOrder=asc

//http://localhost:4008/api/salesrecord?sortBy=transactionprice&sortOrder=asc
const buildSortOptions = (query) => {
    const sortOptions = {};
    const errors = [];

    if (query.sortBy) {
        const validSortFields = ['date', 'transactionprice', 'car', 'buyer', 'salesman'];
        if (!validSortFields.includes(query.sortBy)) {
            errors.push(`Invalid sort field: ${query.sortBy}. Valid fields are: ${validSortFields.join(', ')}`);
        } else {
            const sortOrder = query.sortOrder === 'desc' ? -1 : 1;
            const sortFieldMap = {
                'date': 'purchasedate',
                'transactionprice': 'transactionprice',
                'car': 'car.brandname',
                'buyer': 'buyer.firstname',
                'salesman': 'salesman',
                'price': 'car.price'
            };
            sortOptions[sortFieldMap[query.sortBy]] = sortOrder;
        }
    }

    return { sortOptions, errors };
};

// Middleware to build query parameters
const queryBuilder = (req, res, next) => {
    try {
        // Build query conditions
        const { conditions, errors: conditionErrors } = buildQueryConditions(req.query);

        // Build sort options
        const { sortOptions, errors: sortErrors } = buildSortOptions(req.query);

        // Combine all errors
        const errors = [...conditionErrors, ...sortErrors];

        // If there are any errors, return them
        if (errors.length > 0) {
            return res.status(400).json({
                error: "Invalid query parameters",
                details: errors
            });
        }

        // Get pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Validate pagination parameters
        if (page < 1 || limit < 1 || limit > 100) {
            return res.status(400).json({
                error: "Invalid pagination parameters",
                details: "Page must be greater than 0, limit must be between 1 and 100"
            });
        }

        // Store the processed parameters in the request object
        req.queryConditions = conditions;
        req.sortOptions = sortOptions;
        req.pagination = {
            page,
            limit,
            skip: (page - 1) * limit
        };

        next();
    } catch (error) {
        console.error('Query builder error:', error);
        return res.status(400).json({
            error: "Error processing query parameters",
            details: error.message
        });
    }
};

module.exports = queryBuilder; 