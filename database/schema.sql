-- Tally SQL Mobile App - Database Schema
-- Run this on your SQL Server before starting sync

CREATE DATABASE TallyDB;
GO

USE TallyDB;
GO

-- Ledgers Table
CREATE TABLE Ledgers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    GroupName NVARCHAR(255),
    Balance DECIMAL(18,2) DEFAULT 0,
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Vouchers Table
CREATE TABLE Vouchers (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    VoucherNo NVARCHAR(100) UNIQUE,
    Date DATE,
    Type NVARCHAR(50),
    Amount DECIMAL(18,2) DEFAULT 0,
    Narration NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Stock Items Table
CREATE TABLE StockItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(255) NOT NULL UNIQUE,
    GroupName NVARCHAR(255),
    ClosingQty DECIMAL(18,3) DEFAULT 0,
    Rate DECIMAL(18,2) DEFAULT 0,
    UpdatedAt DATETIME DEFAULT GETDATE()
);
GO

-- Indexes for faster queries
CREATE INDEX IX_Vouchers_Date ON Vouchers(Date);
CREATE INDEX IX_Vouchers_Type ON Vouchers(Type);
CREATE INDEX IX_Ledgers_Name ON Ledgers(Name);
GO

-- Sample view for sales report
CREATE VIEW SalesSummary AS
SELECT
    YEAR(Date) AS Year,
    MONTH(Date) AS Month,
    SUM(Amount) AS TotalSales,
    COUNT(*) AS VoucherCount
FROM Vouchers
WHERE Type = 'Sales'
GROUP BY YEAR(Date), MONTH(Date);
GO
