-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 15, 2026 at 03:08 PM
-- Server version: 10.11.15-MariaDB
-- PHP Version: 8.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pythonmanageproj_unicharm`
--

-- --------------------------------------------------------

--
-- Table structure for table `Accountant`
--

CREATE TABLE `Accountant` (
  `Id` bigint(20) NOT NULL,
  `EmployeeId` bigint(20) DEFAULT NULL,
  `EmpId` varchar(100) DEFAULT NULL,
  `UserName` varchar(100) DEFAULT NULL,
  `Password` varchar(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp(),
  `IsAdmin` tinyint(1) DEFAULT NULL,
  `Category` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AccountantZone`
--

CREATE TABLE `AccountantZone` (
  `Id` bigint(20) NOT NULL,
  `AccountantId` bigint(20) DEFAULT NULL,
  `Unit` bigint(20) DEFAULT NULL,
  `Zone` bigint(20) DEFAULT NULL,
  `Location` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Agreement`
--

CREATE TABLE `Agreement` (
  `Id` int(11) NOT NULL,
  `Description` longtext DEFAULT NULL,
  `IsCompleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `AuditorDetail`
--

CREATE TABLE `AuditorDetail` (
  `Id` bigint(20) NOT NULL,
  `AuditorId` bigint(20) DEFAULT NULL,
  `Unit` bigint(20) DEFAULT NULL,
  `Zone` bigint(20) DEFAULT NULL,
  `Location` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Auditors`
--

CREATE TABLE `Auditors` (
  `Id` bigint(20) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `MobileNo` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Unit` bigint(20) DEFAULT NULL,
  `Zone` bigint(20) DEFAULT NULL,
  `Location` bigint(20) DEFAULT NULL,
  `UserName` varchar(20) DEFAULT NULL,
  `Password` varchar(20) DEFAULT NULL,
  `IsAdmin` tinyint(1) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp(),
  `Category` varchar(100) DEFAULT NULL,
  `UserPhoto` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ChoreiMessage`
--

CREATE TABLE `ChoreiMessage` (
  `Id` bigint(20) NOT NULL,
  `PdfPath` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp(),
  `Title` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `City`
--

CREATE TABLE `City` (
  `Id` bigint(20) NOT NULL,
  `Name` varchar(250) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0,
  `StateId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

CREATE TABLE `ci_sessions` (
  `id` varchar(500) DEFAULT NULL,
  `ip_address` varchar(500) DEFAULT NULL,
  `timestamp` int(11) DEFAULT NULL,
  `data` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CompanyImages`
--

CREATE TABLE CompanyImages (
  Id BIGINT(20) NOT NULL AUTO_INCREMENT,
  CreatedOn DATETIME DEFAULT CURRENT_TIMESTAMP,
  IsDeleted TINYINT(1) DEFAULT 0,
  ImagePath VARCHAR(255) DEFAULT NULL,
  ImageName VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (Id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `CustomImage`
--

CREATE TABLE `CustomImage` (
  `Id` bigint(20) NOT NULL,
  `Image` longtext DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL,
  `ShowType` varchar(50) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `CuurencyMaster`
--

CREATE TABLE `CuurencyMaster` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `INRValue` decimal(18,2) DEFAULT NULL,
  `ConvertedValue` decimal(18,2) DEFAULT NULL,
  `CreatedBy` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Departments`
--

CREATE TABLE `Departments` (
  `Id` bigint(20) NOT NULL,
  `DepartmentName` varchar(100) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `CostCenter` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Designation`
--

CREATE TABLE `Designation` (
  `Id` bigint(20) NOT NULL,
  `DesignationName` varchar(100) DEFAULT NULL,
  `DepartmentId` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Employees`
--

CREATE TABLE `Employees` (
  `Id` bigint(20) NOT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `DepartmentId` bigint(20) DEFAULT NULL,
  `DesignationId` bigint(20) DEFAULT NULL,
  `RoleId` bigint(20) DEFAULT NULL,
  `Birthdate` datetime DEFAULT NULL,
  `MobileNo1` varchar(100) DEFAULT NULL,
  `MobileNo2` varchar(100) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Joiningdate` datetime DEFAULT NULL,
  `UserPhoto` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) NOT NULL DEFAULT 0,
  `UserName` varchar(20) DEFAULT NULL,
  `Password` varchar(20) DEFAULT NULL,
  `DeviceId` longtext DEFAULT NULL,
  `EmpId` varchar(100) DEFAULT NULL,
  `Category` varchar(100) DEFAULT NULL,
  `Unit` varchar(100) DEFAULT NULL,
  `Zone` varchar(100) DEFAULT NULL,
  `Location` varchar(100) DEFAULT '7',
  `State` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Supervisor` varchar(100) DEFAULT NULL,
  `SupervisorEmpId` varchar(100) DEFAULT NULL,
  `BankAccountNo` varchar(100) DEFAULT NULL,
  `BankName` varchar(100) DEFAULT NULL,
  `IfscCode` varchar(100) DEFAULT NULL,
  `LoginToken` varchar(500) DEFAULT NULL,
  `ExpenseDepartment` varchar(100) DEFAULT NULL,
  `UserType` varchar(100) DEFAULT NULL,
  `TTMT` varchar(100) DEFAULT NULL,
  `SecretaryId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Image` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ExpenseCatagory`
--

CREATE TABLE `ExpenseCatagory` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ExpenseDesignation`
--

CREATE TABLE `ExpenseDesignation` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ExpenseLocation`
--

CREATE TABLE `ExpenseLocation` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `ZoneId` int(11) DEFAULT NULL,
  `UnitId` int(11) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Floor`
--

CREATE TABLE `Floor` (
  `Id` bigint(20) NOT NULL,
  `FloorName` varchar(100) DEFAULT NULL,
  `Location` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Group`
--

CREATE TABLE `Group` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `GroupMember`
--

CREATE TABLE `GroupMember` (
  `Id` bigint(20) NOT NULL,
  `GroupId` int(11) DEFAULT NULL,
  `MemberId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Holiday`
--

CREATE TABLE `Holiday` (
  `Id` bigint(20) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `HolidayDate` date DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LikeComment`
--

CREATE TABLE `LikeComment` (
  `Id` bigint(20) NOT NULL,
  `Type` varchar(100) DEFAULT NULL,
  `LikeOrComment` varchar(100) DEFAULT NULL,
  `Comment` varchar(500) DEFAULT NULL,
  `ParentId` bigint(20) DEFAULT NULL,
  `UserId` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Location`
--

CREATE TABLE `Location` (
  `Id` bigint(20) NOT NULL,
  `LocationName` varchar(100) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `LoginDetail`
--

CREATE TABLE `LoginDetail` (
  `LoginId` bigint(20) NOT NULL,
  `UserId` bigint(20) DEFAULT NULL,
  `LoginUserType` int(11) DEFAULT NULL,
  `LoginDatetime` datetime DEFAULT NULL,
  `LogoutDatetime` datetime DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT NULL,
  `CreatedDate` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `MACAddress` longtext DEFAULT NULL,
  `IPAddress` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `masterLogs`
--

CREATE TABLE `masterLogs` (
  `Id` bigint(20) NOT NULL,
  `UserId` bigint(20) DEFAULT NULL,
  `LoginUserType` int(11) DEFAULT NULL,
  `Module` varchar(100) DEFAULT NULL,
  `Action` varchar(100) DEFAULT NULL,
  `ModuleId` bigint(20) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `CreatedDate` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `MeetingDetails`
--

CREATE TABLE `MeetingDetails` (
  `Id` bigint(20) NOT NULL,
  `Location` bigint(20) DEFAULT NULL,
  `Floor` bigint(20) DEFAULT NULL,
  `Room` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `Purpose` longtext DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `TimeFrom` varchar(50) DEFAULT NULL,
  `TimeTo` varchar(50) DEFAULT NULL,
  `AproveStatus` varchar(50) DEFAULT NULL,
  `AprovedBy` varchar(50) DEFAULT NULL,
  `AproveComment` varchar(500) DEFAULT NULL,
  `AproveTime` datetime DEFAULT NULL,
  `UserId` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `MeetingNotification`
--

CREATE TABLE `MeetingNotification` (
  `Id` bigint(20) NOT NULL,
  `UserId` bigint(20) DEFAULT NULL,
  `MobileNo1` varchar(100) DEFAULT NULL,
  `MobileNo2` varchar(100) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Messages`
--

CREATE TABLE `Messages` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Quote` varchar(500) DEFAULT NULL,
  `RoleId` bigint(20) DEFAULT NULL,
  `AddedBy` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `News`
--

CREATE TABLE `News` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Image` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Notice`
--

CREATE TABLE `Notice` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `Role` bigint(20) DEFAULT NULL,
  `Date` date DEFAULT NULL,
  `Image` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PhotoGallery`
--

CREATE TABLE `PhotoGallery` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Image` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Policies`
--

CREATE TABLE `Policies` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `Catagory` bigint(20) DEFAULT NULL,
  `Role` bigint(20) DEFAULT NULL,
  `Date` datetime DEFAULT current_timestamp(),
  `Image` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PolicyNew`
--

CREATE TABLE `PolicyNew` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `PdfPath` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `PreorityMaster`
--

CREATE TABLE `PreorityMaster` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `LimitHour` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Product`
--

CREATE TABLE `Product` (
  `Id` bigint(20) NOT NULL,
  `Name` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `UserPhoto` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `QuoteOfTheDay`
--

CREATE TABLE `QuoteOfTheDay` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Quote` varchar(500) DEFAULT NULL,
  `AddedBy` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Region`
--

CREATE TABLE `Region` (
  `Id` bigint(20) NOT NULL,
  `Name` varchar(250) DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `Id` bigint(20) NOT NULL,
  `RoleName` varchar(100) DEFAULT NULL,
  `DesignationId` bigint(20) DEFAULT NULL,
  `DepartmentId` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Room`
--

CREATE TABLE `Room` (
  `Id` bigint(20) NOT NULL,
  `RoomName` varchar(100) DEFAULT NULL,
  `Location` bigint(20) DEFAULT NULL,
  `Floor` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Tags`
--

CREATE TABLE `Tags` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL,
  `IsDeleted` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Ticket`
--

CREATE TABLE `Ticket` (
  `Id` bigint(20) NOT NULL,
  `Requester` bigint(20) DEFAULT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Region` varchar(250) DEFAULT NULL,
  `City` varchar(250) DEFAULT NULL,
  `TypeId` int(11) DEFAULT NULL,
  `TagId` int(11) DEFAULT NULL,
  `PreorityId` int(11) DEFAULT NULL,
  `Status` varchar(250) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `IsManagerNotified` tinyint(1) DEFAULT 0,
  `MobileNo` varchar(250) DEFAULT NULL,
  `IsClosed` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TicketAssignee`
--

CREATE TABLE `TicketAssignee` (
  `Id` bigint(20) NOT NULL,
  `TicketId` int(11) DEFAULT NULL,
  `AssigneeId` int(11) DEFAULT NULL,
  `Status` varchar(250) DEFAULT NULL,
  `Name` varchar(250) DEFAULT NULL,
  `GroupName` varchar(250) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TicketFeedback`
--

CREATE TABLE `TicketFeedback` (
  `Id` bigint(20) NOT NULL,
  `TicketId` bigint(20) DEFAULT NULL,
  `FeedBackBy` bigint(20) DEFAULT NULL,
  `Feedback` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `Star1` tinyint(1) DEFAULT NULL,
  `Star2` tinyint(1) DEFAULT NULL,
  `Star3` tinyint(1) DEFAULT NULL,
  `Star4` tinyint(1) DEFAULT NULL,
  `Star5` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TicketFollower`
--

CREATE TABLE `TicketFollower` (
  `Id` bigint(20) NOT NULL,
  `TicketId` int(11) DEFAULT NULL,
  `FollowerId` int(11) DEFAULT NULL,
  `Status` varchar(250) DEFAULT NULL,
  `Name` varchar(250) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TicketReply`
--

CREATE TABLE `TicketReply` (
  `Id` bigint(20) NOT NULL,
  `TicketId` bigint(20) DEFAULT NULL,
  `RepliedbyBy` bigint(20) DEFAULT NULL,
  `ReplyType` varchar(100) DEFAULT NULL,
  `Reply` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TicketTag`
--

CREATE TABLE `TicketTag` (
  `Id` bigint(20) NOT NULL,
  `TicketId` int(11) DEFAULT NULL,
  `TagId` int(11) DEFAULT NULL,
  `Name` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TodaysBirthdateAndAnniversary`
--

CREATE TABLE `TodaysBirthdateAndAnniversary` (
  `Id` bigint(20) NOT NULL,
  `Type` varchar(100) DEFAULT NULL,
  `BirthdateUsertId` bigint(20) DEFAULT NULL,
  `Birthdate` date DEFAULT NULL,
  `Comment` varchar(500) DEFAULT NULL,
  `CommentUserId` bigint(20) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `TypeMaster`
--

CREATE TABLE `TypeMaster` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Units`
--

CREATE TABLE `Units` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `UploadedImages`
--

CREATE TABLE `UploadedImages` (
  `Id` bigint(20) NOT NULL,
  `Type` varchar(100) DEFAULT NULL,
  `ParentId` longtext DEFAULT NULL,
  `Image` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Wall`
--

CREATE TABLE `Wall` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Description` longtext DEFAULT NULL,
  `Image` longtext DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `AddedBy` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Zone`
--

CREATE TABLE `Zone` (
  `Id` bigint(20) NOT NULL,
  `Title` varchar(250) DEFAULT NULL,
  `CreatedOn` datetime DEFAULT current_timestamp(),
  `IsDeleted` tinyint(1) DEFAULT 0,
  `ModifiedOn` datetime DEFAULT current_timestamp(),
  `Unit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Accountant`
--
ALTER TABLE `Accountant`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `AccountantZone`
--
ALTER TABLE `AccountantZone`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Agreement`
--
ALTER TABLE `Agreement`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `AuditorDetail`
--
ALTER TABLE `AuditorDetail`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Auditors`
--
ALTER TABLE `Auditors`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `ChoreiMessage`
--
ALTER TABLE `ChoreiMessage`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `City`
--
ALTER TABLE `City`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `CompanyImages`
--
ALTER TABLE `CompanyImages`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `CustomImage`
--
ALTER TABLE `CustomImage`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `CuurencyMaster`
--
ALTER TABLE `CuurencyMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Departments`
--
ALTER TABLE `Departments`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Designation`
--
ALTER TABLE `Designation`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Employees`
--
ALTER TABLE `Employees`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `ExpenseCatagory`
--
ALTER TABLE `ExpenseCatagory`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `ExpenseDesignation`
--
ALTER TABLE `ExpenseDesignation`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `ExpenseLocation`
--
ALTER TABLE `ExpenseLocation`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Floor`
--
ALTER TABLE `Floor`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Group`
--
ALTER TABLE `Group`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `GroupMember`
--
ALTER TABLE `GroupMember`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Holiday`
--
ALTER TABLE `Holiday`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `LikeComment`
--
ALTER TABLE `LikeComment`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Location`
--
ALTER TABLE `Location`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `LoginDetail`
--
ALTER TABLE `LoginDetail`
  ADD PRIMARY KEY (`LoginId`);

--
-- Indexes for table `masterLogs`
--
ALTER TABLE `masterLogs`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `MeetingDetails`
--
ALTER TABLE `MeetingDetails`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `MeetingNotification`
--
ALTER TABLE `MeetingNotification`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `News`
--
ALTER TABLE `News`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Notice`
--
ALTER TABLE `Notice`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `PhotoGallery`
--
ALTER TABLE `PhotoGallery`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Policies`
--
ALTER TABLE `Policies`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `PolicyNew`
--
ALTER TABLE `PolicyNew`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `PreorityMaster`
--
ALTER TABLE `PreorityMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `QuoteOfTheDay`
--
ALTER TABLE `QuoteOfTheDay`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Region`
--
ALTER TABLE `Region`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Room`
--
ALTER TABLE `Room`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Tags`
--
ALTER TABLE `Tags`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Ticket`
--
ALTER TABLE `Ticket`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `TicketAssignee`
--
ALTER TABLE `TicketAssignee`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `TicketFeedback`
--
ALTER TABLE `TicketFeedback`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `TicketFollower`
--
ALTER TABLE `TicketFollower`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `TicketReply`
--
ALTER TABLE `TicketReply`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `TicketTag`
--
ALTER TABLE `TicketTag`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `TodaysBirthdateAndAnniversary`
--
ALTER TABLE `TodaysBirthdateAndAnniversary`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `TypeMaster`
--
ALTER TABLE `TypeMaster`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Units`
--
ALTER TABLE `Units`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `UploadedImages`
--
ALTER TABLE `UploadedImages`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Wall`
--
ALTER TABLE `Wall`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `Zone`
--
ALTER TABLE `Zone`
  ADD PRIMARY KEY (`Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Accountant`
--
ALTER TABLE `Accountant`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `AccountantZone`
--
ALTER TABLE `AccountantZone`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Agreement`
--
ALTER TABLE `Agreement`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `AuditorDetail`
--
ALTER TABLE `AuditorDetail`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Auditors`
--
ALTER TABLE `Auditors`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ChoreiMessage`
--
ALTER TABLE `ChoreiMessage`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `City`
--
ALTER TABLE `City`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CompanyImages`
--
ALTER TABLE `CompanyImages`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CustomImage`
--
ALTER TABLE `CustomImage`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `CuurencyMaster`
--
ALTER TABLE `CuurencyMaster`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Departments`
--
ALTER TABLE `Departments`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Designation`
--
ALTER TABLE `Designation`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Employees`
--
ALTER TABLE `Employees`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ExpenseCatagory`
--
ALTER TABLE `ExpenseCatagory`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ExpenseDesignation`
--
ALTER TABLE `ExpenseDesignation`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ExpenseLocation`
--
ALTER TABLE `ExpenseLocation`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Floor`
--
ALTER TABLE `Floor`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Group`
--
ALTER TABLE `Group`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `GroupMember`
--
ALTER TABLE `GroupMember`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Holiday`
--
ALTER TABLE `Holiday`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `LikeComment`
--
ALTER TABLE `LikeComment`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Location`
--
ALTER TABLE `Location`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `LoginDetail`
--
ALTER TABLE `LoginDetail`
  MODIFY `LoginId` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `masterLogs`
--
ALTER TABLE `masterLogs`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `MeetingDetails`
--
ALTER TABLE `MeetingDetails`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `MeetingNotification`
--
ALTER TABLE `MeetingNotification`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Messages`
--
ALTER TABLE `Messages`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `News`
--
ALTER TABLE `News`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Notice`
--
ALTER TABLE `Notice`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PhotoGallery`
--
ALTER TABLE `PhotoGallery`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Policies`
--
ALTER TABLE `Policies`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PolicyNew`
--
ALTER TABLE `PolicyNew`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `PreorityMaster`
--
ALTER TABLE `PreorityMaster`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Product`
--
ALTER TABLE `Product`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `QuoteOfTheDay`
--
ALTER TABLE `QuoteOfTheDay`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Region`
--
ALTER TABLE `Region`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Room`
--
ALTER TABLE `Room`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Tags`
--
ALTER TABLE `Tags`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Ticket`
--
ALTER TABLE `Ticket`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TicketAssignee`
--
ALTER TABLE `TicketAssignee`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TicketFeedback`
--
ALTER TABLE `TicketFeedback`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TicketFollower`
--
ALTER TABLE `TicketFollower`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TicketReply`
--
ALTER TABLE `TicketReply`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TicketTag`
--
ALTER TABLE `TicketTag`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TodaysBirthdateAndAnniversary`
--
ALTER TABLE `TodaysBirthdateAndAnniversary`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `TypeMaster`
--
ALTER TABLE `TypeMaster`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Units`
--
ALTER TABLE `Units`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `UploadedImages`
--
ALTER TABLE `UploadedImages`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Wall`
--
ALTER TABLE `Wall`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Zone`
--
ALTER TABLE `Zone`
  MODIFY `Id` bigint(20) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
