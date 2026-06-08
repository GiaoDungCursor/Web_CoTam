/*
  EduPro E-Learning Platform - Microsoft SQL Server schema

  How to use:
  1. Open SQL Server Management Studio or Azure Data Studio.
  2. Connect to your SQL Server instance.
  3. Run this file.

  This script creates a database named EduProDb, core tables, indexes,
  constraints, and seed data for roles/categories/courses.
*/

IF DB_ID(N'EduProDb') IS NULL
BEGIN
    CREATE DATABASE EduProDb;
END;
GO

USE EduProDb;
GO

SET ANSI_NULLS ON;
SET QUOTED_IDENTIFIER ON;
GO

IF OBJECT_ID(N'dbo.Reviews', N'U') IS NOT NULL DROP TABLE dbo.Reviews;
IF OBJECT_ID(N'dbo.LessonProgress', N'U') IS NOT NULL DROP TABLE dbo.LessonProgress;
IF OBJECT_ID(N'dbo.Enrollments', N'U') IS NOT NULL DROP TABLE dbo.Enrollments;
IF OBJECT_ID(N'dbo.Payments', N'U') IS NOT NULL DROP TABLE dbo.Payments;
IF OBJECT_ID(N'dbo.OrderItems', N'U') IS NOT NULL DROP TABLE dbo.OrderItems;
IF OBJECT_ID(N'dbo.Orders', N'U') IS NOT NULL DROP TABLE dbo.Orders;
IF OBJECT_ID(N'dbo.CartItems', N'U') IS NOT NULL DROP TABLE dbo.CartItems;
IF OBJECT_ID(N'dbo.Carts', N'U') IS NOT NULL DROP TABLE dbo.Carts;
IF OBJECT_ID(N'dbo.LessonAssets', N'U') IS NOT NULL DROP TABLE dbo.LessonAssets;
IF OBJECT_ID(N'dbo.Lessons', N'U') IS NOT NULL DROP TABLE dbo.Lessons;
IF OBJECT_ID(N'dbo.CourseSections', N'U') IS NOT NULL DROP TABLE dbo.CourseSections;
IF OBJECT_ID(N'dbo.Courses', N'U') IS NOT NULL DROP TABLE dbo.Courses;
IF OBJECT_ID(N'dbo.Categories', N'U') IS NOT NULL DROP TABLE dbo.Categories;
IF OBJECT_ID(N'dbo.RefreshTokens', N'U') IS NOT NULL DROP TABLE dbo.RefreshTokens;
IF OBJECT_ID(N'dbo.UserOAuthAccounts', N'U') IS NOT NULL DROP TABLE dbo.UserOAuthAccounts;
IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL DROP TABLE dbo.Users;
IF OBJECT_ID(N'dbo.Roles', N'U') IS NOT NULL DROP TABLE dbo.Roles;
GO

CREATE TABLE dbo.Roles (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Roles PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(50) NOT NULL CONSTRAINT UQ_Roles_Name UNIQUE,
    Description NVARCHAR(255) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Roles_CreatedAt DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE dbo.Users (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Users PRIMARY KEY DEFAULT NEWID(),
    RoleId UNIQUEIDENTIFIER NOT NULL,
    FullName NVARCHAR(150) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    PasswordHash NVARCHAR(255) NULL,
    AvatarUrl NVARCHAR(1000) NULL,
    Phone NVARCHAR(30) NULL,
    IsActive BIT NOT NULL CONSTRAINT DF_Users_IsActive DEFAULT 1,
    EmailVerifiedAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(Id)
);
GO

CREATE TABLE dbo.UserOAuthAccounts (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_UserOAuthAccounts PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Provider NVARCHAR(50) NOT NULL,
    ProviderUserId NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_UserOAuthAccounts_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_UserOAuthAccounts_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT UQ_UserOAuthAccounts_ProviderUser UNIQUE (Provider, ProviderUserId)
);
GO

CREATE TABLE dbo.RefreshTokens (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_RefreshTokens PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    TokenHash NVARCHAR(255) NOT NULL,
    ExpiresAt DATETIME2(0) NOT NULL,
    RevokedAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_RefreshTokens_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_RefreshTokens_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Categories (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Categories PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(120) NOT NULL,
    Slug NVARCHAR(160) NOT NULL,
    Description NVARCHAR(500) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Categories_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Categories_Name UNIQUE (Name),
    CONSTRAINT UQ_Categories_Slug UNIQUE (Slug)
);
GO

CREATE TABLE dbo.Courses (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Courses PRIMARY KEY DEFAULT NEWID(),
    CategoryId UNIQUEIDENTIFIER NOT NULL,
    InstructorId UNIQUEIDENTIFIER NULL,
    Title NVARCHAR(255) NOT NULL,
    Slug NVARCHAR(300) NOT NULL,
    Description NVARCHAR(MAX) NOT NULL,
    Price DECIMAL(18, 2) NOT NULL CONSTRAINT DF_Courses_Price DEFAULT 0,
    OriginalPrice DECIMAL(18, 2) NOT NULL CONSTRAINT DF_Courses_OriginalPrice DEFAULT 0,
    Rating DECIMAL(3, 2) NOT NULL CONSTRAINT DF_Courses_Rating DEFAULT 0,
    Students INT NOT NULL CONSTRAINT DF_Courses_Students DEFAULT 0,
    ImageUrl NVARCHAR(1000) NULL,
    Level NVARCHAR(30) NOT NULL,
    Duration NVARCHAR(50) NOT NULL,
    Status NVARCHAR(30) NOT NULL CONSTRAINT DF_Courses_Status DEFAULT N'draft',
    PublishedAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Courses_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Courses_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Courses_Slug UNIQUE (Slug),
    CONSTRAINT CK_Courses_Level CHECK (Level IN (N'Cơ bản', N'Trung bình', N'Nâng cao')),
    CONSTRAINT CK_Courses_Status CHECK (Status IN (N'draft', N'pending_review', N'published', N'archived')),
    CONSTRAINT CK_Courses_Price CHECK (Price >= 0),
    CONSTRAINT CK_Courses_OriginalPrice CHECK (OriginalPrice >= 0),
    CONSTRAINT CK_Courses_Rating CHECK (Rating >= 0 AND Rating <= 5),
    CONSTRAINT CK_Courses_Students CHECK (Students >= 0),
    CONSTRAINT FK_Courses_Categories FOREIGN KEY (CategoryId) REFERENCES dbo.Categories(Id),
    CONSTRAINT FK_Courses_Instructor FOREIGN KEY (InstructorId) REFERENCES dbo.Users(Id)
);
GO

CREATE TABLE dbo.CourseSections (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_CourseSections PRIMARY KEY DEFAULT NEWID(),
    CourseId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    SortOrder INT NOT NULL CONSTRAINT DF_CourseSections_SortOrder DEFAULT 0,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_CourseSections_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_CourseSections_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Lessons (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Lessons PRIMARY KEY DEFAULT NEWID(),
    SectionId UNIQUEIDENTIFIER NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Description NVARCHAR(MAX) NULL,
    VideoUrl NVARCHAR(1000) NULL,
    DurationSeconds INT NOT NULL CONSTRAINT DF_Lessons_DurationSeconds DEFAULT 0,
    IsPreview BIT NOT NULL CONSTRAINT DF_Lessons_IsPreview DEFAULT 0,
    SortOrder INT NOT NULL CONSTRAINT DF_Lessons_SortOrder DEFAULT 0,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Lessons_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Lessons_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_Lessons_DurationSeconds CHECK (DurationSeconds >= 0),
    CONSTRAINT FK_Lessons_CourseSections FOREIGN KEY (SectionId) REFERENCES dbo.CourseSections(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.LessonAssets (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_LessonAssets PRIMARY KEY DEFAULT NEWID(),
    LessonId UNIQUEIDENTIFIER NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FileUrl NVARCHAR(1000) NOT NULL,
    FileType NVARCHAR(80) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_LessonAssets_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_LessonAssets_Lessons FOREIGN KEY (LessonId) REFERENCES dbo.Lessons(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Carts (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Carts PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Carts_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Carts_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Carts_User UNIQUE (UserId),
    CONSTRAINT FK_Carts_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.CartItems (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_CartItems PRIMARY KEY DEFAULT NEWID(),
    CartId UNIQUEIDENTIFIER NOT NULL,
    CourseId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_CartItems_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_CartItems_CartCourse UNIQUE (CartId, CourseId),
    CONSTRAINT FK_CartItems_Carts FOREIGN KEY (CartId) REFERENCES dbo.Carts(Id) ON DELETE CASCADE,
    CONSTRAINT FK_CartItems_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id)
);
GO

CREATE TABLE dbo.Orders (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Orders PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    OrderCode NVARCHAR(40) NOT NULL,
    TotalAmount DECIMAL(18, 2) NOT NULL,
    Status NVARCHAR(30) NOT NULL CONSTRAINT DF_Orders_Status DEFAULT N'pending',
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Orders_CreatedAt DEFAULT SYSUTCDATETIME(),
    PaidAt DATETIME2(0) NULL,
    CONSTRAINT UQ_Orders_OrderCode UNIQUE (OrderCode),
    CONSTRAINT CK_Orders_Status CHECK (Status IN (N'pending', N'paid', N'failed', N'cancelled', N'refunded')),
    CONSTRAINT CK_Orders_TotalAmount CHECK (TotalAmount >= 0),
    CONSTRAINT FK_Orders_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id)
);
GO

CREATE TABLE dbo.OrderItems (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_OrderItems PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER NOT NULL,
    CourseId UNIQUEIDENTIFIER NOT NULL,
    Price DECIMAL(18, 2) NOT NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_OrderItems_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_OrderItems_OrderCourse UNIQUE (OrderId, CourseId),
    CONSTRAINT CK_OrderItems_Price CHECK (Price >= 0),
    CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(Id) ON DELETE CASCADE,
    CONSTRAINT FK_OrderItems_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id)
);
GO

CREATE TABLE dbo.Payments (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Payments PRIMARY KEY DEFAULT NEWID(),
    OrderId UNIQUEIDENTIFIER NOT NULL,
    Provider NVARCHAR(50) NOT NULL,
    ProviderTransactionId NVARCHAR(255) NULL,
    Amount DECIMAL(18, 2) NOT NULL,
    Status NVARCHAR(30) NOT NULL CONSTRAINT DF_Payments_Status DEFAULT N'pending',
    RawPayload NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Payments_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Payments_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT CK_Payments_Status CHECK (Status IN (N'pending', N'success', N'failed', N'refunded')),
    CONSTRAINT CK_Payments_Amount CHECK (Amount >= 0),
    CONSTRAINT FK_Payments_Orders FOREIGN KEY (OrderId) REFERENCES dbo.Orders(Id) ON DELETE CASCADE
);
GO

CREATE TABLE dbo.Enrollments (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Enrollments PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    CourseId UNIQUEIDENTIFIER NOT NULL,
    OrderItemId UNIQUEIDENTIFIER NULL,
    ProgressPercentage DECIMAL(5, 2) NOT NULL CONSTRAINT DF_Enrollments_Progress DEFAULT 0,
    EnrolledAt DATETIME2(0) NOT NULL CONSTRAINT DF_Enrollments_EnrolledAt DEFAULT SYSUTCDATETIME(),
    CompletedAt DATETIME2(0) NULL,
    CONSTRAINT UQ_Enrollments_UserCourse UNIQUE (UserId, CourseId),
    CONSTRAINT CK_Enrollments_Progress CHECK (ProgressPercentage >= 0 AND ProgressPercentage <= 100),
    CONSTRAINT FK_Enrollments_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Enrollments_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id),
    CONSTRAINT FK_Enrollments_OrderItems FOREIGN KEY (OrderItemId) REFERENCES dbo.OrderItems(Id)
);
GO

CREATE TABLE dbo.LessonProgress (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_LessonProgress PRIMARY KEY DEFAULT NEWID(),
    EnrollmentId UNIQUEIDENTIFIER NOT NULL,
    LessonId UNIQUEIDENTIFIER NOT NULL,
    IsCompleted BIT NOT NULL CONSTRAINT DF_LessonProgress_IsCompleted DEFAULT 0,
    CompletedAt DATETIME2(0) NULL,
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_LessonProgress_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_LessonProgress_EnrollmentLesson UNIQUE (EnrollmentId, LessonId),
    CONSTRAINT FK_LessonProgress_Enrollments FOREIGN KEY (EnrollmentId) REFERENCES dbo.Enrollments(Id) ON DELETE CASCADE,
    CONSTRAINT FK_LessonProgress_Lessons FOREIGN KEY (LessonId) REFERENCES dbo.Lessons(Id)
);
GO

CREATE TABLE dbo.Reviews (
    Id UNIQUEIDENTIFIER NOT NULL CONSTRAINT PK_Reviews PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    CourseId UNIQUEIDENTIFIER NOT NULL,
    Rating INT NOT NULL,
    Comment NVARCHAR(MAX) NULL,
    CreatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Reviews_CreatedAt DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL CONSTRAINT DF_Reviews_UpdatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT UQ_Reviews_UserCourse UNIQUE (UserId, CourseId),
    CONSTRAINT CK_Reviews_Rating CHECK (Rating >= 1 AND Rating <= 5),
    CONSTRAINT FK_Reviews_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Reviews_Courses FOREIGN KEY (CourseId) REFERENCES dbo.Courses(Id) ON DELETE CASCADE
);
GO

CREATE INDEX IX_Users_RoleId ON dbo.Users(RoleId);
CREATE INDEX IX_Courses_CategoryId ON dbo.Courses(CategoryId);
CREATE INDEX IX_Courses_InstructorId ON dbo.Courses(InstructorId);
CREATE INDEX IX_Courses_Status ON dbo.Courses(Status);
CREATE INDEX IX_CourseSections_CourseId ON dbo.CourseSections(CourseId);
CREATE INDEX IX_Lessons_SectionId ON dbo.Lessons(SectionId);
CREATE INDEX IX_Orders_UserId ON dbo.Orders(UserId);
CREATE INDEX IX_OrderItems_CourseId ON dbo.OrderItems(CourseId);
CREATE INDEX IX_Payments_OrderId ON dbo.Payments(OrderId);
CREATE INDEX IX_Enrollments_CourseId ON dbo.Enrollments(CourseId);
CREATE INDEX IX_LessonProgress_LessonId ON dbo.LessonProgress(LessonId);
GO

INSERT INTO dbo.Roles (Name, Description)
VALUES
    (N'student', N'Học viên'),
    (N'instructor', N'Giảng viên'),
    (N'admin', N'Quản trị viên'),
    (N'super_admin', N'Quản trị viên cấp cao');
GO

INSERT INTO dbo.Categories (Name, Slug, Description)
VALUES
    (N'Lập trình Web', N'lap-trinh-web', N'Các khóa học lập trình web frontend và backend'),
    (N'Thiết kế', N'thiet-ke', N'Các khóa học UI/UX và thiết kế sản phẩm'),
    (N'Data Science', N'data-science', N'Khoa học dữ liệu, AI và machine learning'),
    (N'Ngoại ngữ', N'ngoai-ngu', N'Kỹ năng ngoại ngữ phục vụ công việc');
GO

DECLARE @WebCategoryId UNIQUEIDENTIFIER = (SELECT Id FROM dbo.Categories WHERE Slug = N'lap-trinh-web');
DECLARE @DesignCategoryId UNIQUEIDENTIFIER = (SELECT Id FROM dbo.Categories WHERE Slug = N'thiet-ke');
DECLARE @DataCategoryId UNIQUEIDENTIFIER = (SELECT Id FROM dbo.Categories WHERE Slug = N'data-science');
DECLARE @LanguageCategoryId UNIQUEIDENTIFIER = (SELECT Id FROM dbo.Categories WHERE Slug = N'ngoai-ngu');

INSERT INTO dbo.Courses (
    CategoryId,
    Title,
    Slug,
    Description,
    Price,
    OriginalPrice,
    Rating,
    Students,
    ImageUrl,
    Level,
    Duration,
    Status,
    PublishedAt
)
VALUES
    (
        @WebCategoryId,
        N'React JS Thực Chiến: Từ Cơ Bản Đến Chuyên Sâu',
        N'react-js-thuc-chien-tu-co-ban-den-chuyen-sau',
        N'Khóa học React JS toàn diện, bao gồm Hooks, Context, Redux và Next.js. Học qua các dự án thực tế.',
        599000,
        1200000,
        4.8,
        1250,
        N'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        N'Cơ bản',
        N'40 giờ',
        N'published',
        SYSUTCDATETIME()
    ),
    (
        @DesignCategoryId,
        N'Thiết Kế UI/UX Chuyên Nghiệp Với Figma',
        N'thiet-ke-ui-ux-chuyen-nghiep-voi-figma',
        N'Làm chủ Figma từ A-Z và quy trình thiết kế UI/UX chuẩn mực để tạo ra sản phẩm đẹp, dễ dùng.',
        499000,
        900000,
        4.9,
        3420,
        N'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        N'Cơ bản',
        N'25 giờ',
        N'published',
        SYSUTCDATETIME()
    ),
    (
        @WebCategoryId,
        N'Lập Trình Backend Node.js, Express và MongoDB',
        N'lap-trinh-backend-nodejs-express-va-mongodb',
        N'Xây dựng backend RESTful API, bảo mật JWT và quản lý database với MongoDB.',
        699000,
        1500000,
        4.7,
        890,
        N'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        N'Trung bình',
        N'55 giờ',
        N'published',
        SYSUTCDATETIME()
    ),
    (
        @WebCategoryId,
        N'Master TypeScript Trong 10 Ngày',
        N'master-typescript-trong-10-ngay',
        N'Nắm vững TypeScript để viết JavaScript an toàn và dễ bảo trì hơn trong React và Node.js.',
        399000,
        800000,
        4.6,
        540,
        N'https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        N'Trung bình',
        N'15 giờ',
        N'published',
        SYSUTCDATETIME()
    ),
    (
        @DataCategoryId,
        N'Data Science & Machine Learning Với Python',
        N'data-science-machine-learning-voi-python',
        N'Khám phá khoa học dữ liệu và xây dựng mô hình AI dự đoán với Pandas, Scikit-learn và TensorFlow.',
        899000,
        2000000,
        4.9,
        2100,
        N'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        N'Nâng cao',
        N'80 giờ',
        N'published',
        SYSUTCDATETIME()
    ),
    (
        @LanguageCategoryId,
        N'Tiếng Anh Giao Tiếp IT',
        N'tieng-anh-giao-tiep-it',
        N'Tự tin giao tiếp tiếng Anh trong môi trường IT, luyện phỏng vấn và viết CV chuẩn quốc tế.',
        450000,
        950000,
        4.8,
        4500,
        N'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        N'Cơ bản',
        N'30 giờ',
        N'published',
        SYSUTCDATETIME()
    );
GO

SELECT
    c.Id,
    c.Title,
    cat.Name AS Category,
    c.Price,
    c.Status
FROM dbo.Courses c
INNER JOIN dbo.Categories cat ON cat.Id = c.CategoryId
ORDER BY c.CreatedAt DESC;
GO
