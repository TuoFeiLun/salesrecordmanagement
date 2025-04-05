const mongoose = require("mongoose");
const axios = require("axios");

const Car = require("../models/car");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
// const validateCarParameters = require("../middleware/validateCarParameters");

exports.car_info_search = asyncHandler(async (req, res, next) => {
    try {
        // Get query parameters
        const { brandname, cartype, productionarea } = req.query;

        // Build API request parameters
        const params = new URLSearchParams({
            cmd: "getTrims",
            year: 2012
        });

        // Add search conditions based on provided parameters
        if (brandname) params.append("make", brandname.toLowerCase());
        if (cartype) params.append("body", cartype);


        // Call third-party API
        const apiUrl = `https://www.carqueryapi.com/api/0.3/?callback=?&${params.toString()}`;
        console.log("Requesting car information from:", apiUrl);

        const response = await axios.get(apiUrl);

        // Parse JSONP response
        let responseData = response.data;

        // Process JSONP formatted response, format is ?({...});
        if (typeof responseData === 'string') {
            // Extract JSON part
            const jsonMatch = responseData.match(/\?\((.*)\);/);
            if (jsonMatch && jsonMatch[1]) {
                try {
                    responseData = JSON.parse(jsonMatch[1]);
                } catch (e) {
                    console.error("Failed to parse JSONP response:", e);
                    return res.status(500).json({
                        error: "Failed to parse external API response",
                        message: "The car information service returned an invalid response"
                    });
                }
            } else {
                return res.status(500).json({
                    error: "Invalid API response format",
                    message: "The external API returned an unexpected format"
                });
            }
        }

        // Format response data
        const cars = [];

        if (responseData && responseData.Trims) {
            // Iterate through vehicle list
            responseData.Trims.forEach(trim => {
                cars.push({
                    brandname: trim.model_make_id,
                    model: trim.model_name,
                    year: trim.model_year,
                    trim: trim.model_trim,
                    cartype: trim.model_body,
                    engine: {
                        position: trim.model_engine_position,
                        cc: trim.model_engine_cc,
                        cylinders: trim.model_engine_cyl,
                        type: trim.model_engine_type,
                        valves_per_cyl: trim.model_engine_valves_per_cyl,
                        power: trim.model_engine_power_ps ? `${trim.model_engine_power_ps} PS` : 'Unknown',
                        power_rpm: trim.model_engine_power_rpm,
                        torque: trim.model_engine_torque_nm ? `${trim.model_engine_torque_nm} Nm` : 'Unknown',
                        torque_rpm: trim.model_engine_torque_rpm,
                        fuel: trim.model_engine_fuel
                    },
                    performance: {
                        top_speed: trim.model_top_speed_kph ? `${trim.model_top_speed_kph} KPH` : 'Unknown',
                        acceleration: trim.model_0_to_100_kph ? `${trim.model_0_to_100_kph}s (0-100 KPH)` : 'Unknown'
                    },
                    dimensions: {
                        weight: trim.model_weight_kg ? `${trim.model_weight_kg} kg` : 'Unknown',
                        length: trim.model_length_mm ? `${trim.model_length_mm} mm` : 'Unknown',
                        width: trim.model_width_mm ? `${trim.model_width_mm} mm` : 'Unknown',
                        height: trim.model_height_mm ? `${trim.model_height_mm} mm` : 'Unknown',
                        wheelbase: trim.model_wheelbase_mm ? `${trim.model_wheelbase_mm} mm` : 'Unknown'
                    },
                    drive: trim.model_drive,
                    transmission: trim.model_transmission_type,
                    seats: trim.model_seats,
                    doors: trim.model_doors,
                    fuel_economy: {
                        highway: trim.model_lkm_hwy ? `${trim.model_lkm_hwy} L/100km` : 'Unknown',
                        city: trim.model_lkm_city ? `${trim.model_lkm_city} L/100km` : 'Unknown',
                        mixed: trim.model_lkm_mixed ? `${trim.model_lkm_mixed} L/100km` : 'Unknown',
                        fuel_capacity: trim.model_fuel_cap_l ? `${trim.model_fuel_cap_l} L` : 'Unknown'
                    },
                    sold_in_us: trim.model_sold_in_us === "1",
                    co2: trim.model_co2,
                    productionarea: trim.make_country || productionarea || 'Unknown'
                });
            });
        }

        // Return formatted results
        res.status(200).json({
            success: true,
            count: cars.length,
            data: cars
        });

    } catch (error) {
        console.error("Car info search error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to fetch car information",
            message: error.message
        });
    }
});

