"use strict";
var Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
    const patient_detail = sequelize.define("patient_detail", {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        DEV_NO: {
            type: DataTypes.STRING(100),
        },
        P_NAME: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        P_ID: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        SEX: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        AGE: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        WEIGHT: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        HEIGHT: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        BSA: {
            type: DataTypes.STRING(100),
        },
        ADDR: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        PRI_BAG_BATCH: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        PRI_DEXT_CONEC: {
            type: DataTypes.STRING(100),
        },
        SEC_BAG_BATCH: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        SEC_DEXT_CONEC: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        TOT_PRI_VOL: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        INIT_DRAIN_VOL: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        LAST_FILL_VOL: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        INF_BYPASS: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        TOT_FILL_VOL: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        TOT_DRAIN_VOL: {
            type: DataTypes.STRING(100),
            // allowNull: false
        },
        ULTRA_FILTR: {
            type: DataTypes.STRING(100),
        },
        DWELL_BUPASS: {
            type: DataTypes.STRING(100),
        },
        TOT_DWELL_TIME: {
            type: DataTypes.STRING(100),
        },
        TOT_DRAIN_TIME: {
            type: DataTypes.STRING(100),
        },
        TOT_CYCLES: {
            type: DataTypes.STRING(100),
        },
        DRAIN_BYPASS: {
            type: DataTypes.STRING(100),
        },
        DATE: {
            type: DataTypes.STRING(100),
        },
        MONTH: {
            type: DataTypes.STRING(100),
        },
        YEAR: {
            type: DataTypes.STRING(100),
        },
        HOUR: {
            type: DataTypes.STRING(100),
        },
        MIN: {
            type: DataTypes.STRING(100),
        },
        SEC: {
            type: DataTypes.STRING(100),
        },
        TH_NAME: {
            type: DataTypes.STRING(100),
        },
        TH_MODE: {
            type: DataTypes.STRING(100),
        },
        CY_DATA: {
            type: DataTypes.STRING(100),
        },
    },
        {
            tableName: "patient_detail",
            underscored: false,
            timestamps: false
        });

    return patient_detail;
};
