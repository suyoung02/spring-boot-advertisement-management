CREATE DATABASE ads_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ads_management;

/*
	Generate some enums
*/

CREATE TABLE PROCESSING_STATUS(
	title NVARCHAR(20),
    PRIMARY KEY (title)
);
INSERT INTO PROCESSING_STATUS VALUES ('Đã gửi');
INSERT INTO PROCESSING_STATUS VALUES ('Đang xử lý');
INSERT INTO PROCESSING_STATUS VALUES ('Đã xử lý');

CREATE TABLE PLANNING_STATUS(
	title NVARCHAR(20),
    PRIMARY KEY (title)
);
INSERT INTO PLANNING_STATUS VALUES ('Đã quy hoạch');
INSERT INTO PLANNING_STATUS VALUES ('Đang quy hoạch');
INSERT INTO PLANNING_STATUS VALUES ('Chưa quy hoạch');

CREATE TABLE INSTALLING_STATUS(
	title NVARCHAR(20),
    PRIMARY KEY (title)
);
INSERT INTO INSTALLING_STATUS VALUES ('Chờ duyệt');
INSERT INTO INSTALLING_STATUS VALUES ('Đang hiện diện');
INSERT INTO INSTALLING_STATUS VALUES ('Đã hết hạn');

CREATE TABLE REPORT_FORM(
	title NVARCHAR(30),
    PRIMARY KEY (title)
);
INSERT INTO REPORT_FORM VALUES ('Tố giác sai phạm');
INSERT INTO REPORT_FORM VALUES ('Đăng ký nội dung');
INSERT INTO REPORT_FORM VALUES ('Đóng góp ý kiến');
INSERT INTO REPORT_FORM VALUES ('Giải đáp thắc mắc');

CREATE TABLE ADS_FORM(
	title NVARCHAR(30),
    PRIMARY KEY (title)
);
INSERT INTO ADS_FORM VALUES ('Cổ động chính trị');
INSERT INTO ADS_FORM VALUES ('Quảng cáo thương mại');
INSERT INTO ADS_FORM VALUES ('Xã hội hoá');

CREATE TABLE LOCATION_TYPE(
	title NVARCHAR(100),
    PRIMARY KEY (title)
);
INSERT INTO LOCATION_TYPE VALUES ('Đất công/Công viên/Hành lang an toàn giao thông');
INSERT INTO LOCATION_TYPE VALUES ('Đất tư nhân/Nhà ở riêng lẻ');
INSERT INTO LOCATION_TYPE VALUES ('Trung tâm thương mại');
INSERT INTO LOCATION_TYPE VALUES ('Chợ');
INSERT INTO LOCATION_TYPE VALUES ('Cây Xăng');
INSERT INTO LOCATION_TYPE VALUES ('Nhà chờ xe buýt');

CREATE TABLE ADS_TYPE(
	title NVARCHAR(50),
    PRIMARY KEY (title)
);
INSERT INTO ADS_TYPE VALUES ('Trụ bảng hiflex');
INSERT INTO ADS_TYPE VALUES ('Trụ màn hình điện tử LED');
INSERT INTO ADS_TYPE VALUES ('Trụ hộp đèn');
INSERT INTO ADS_TYPE VALUES ('Bảng hiflex ốp tường');
INSERT INTO ADS_TYPE VALUES ('Màn hình điện tử ốp tường');
INSERT INTO ADS_TYPE VALUES ('Trụ treo băng rôn dọc');
INSERT INTO ADS_TYPE VALUES ('Trụ treo băng rôn ngang');
INSERT INTO ADS_TYPE VALUES ('Trụ/Cụm pano');
INSERT INTO ADS_TYPE VALUES ('Cổng chào');
INSERT INTO ADS_TYPE VALUES ('Trung tâm thương mại');

/*
	Generate main entities
*/

CREATE TABLE USER(
	username VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('WARD', 'DISTRICT', 'VHTT'),
    ward NVARCHAR(20),
    district NVARCHAR(20),
    refresh_token VARCHAR(255),
    otp CHAR(6),
    expired_otp TIMESTAMP,
    PRIMARY KEY (username)
); 

CREATE TABLE STAFF(
	id INT NOT NULL AUTO_INCREMENT,
    fullname NVARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone_number CHAR(10) NOT NULL,
    username VARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UC_STAFF_username UNIQUE(username),
    CONSTRAINT UC_STAFF_email UNIQUE(email),
    CONSTRAINT FK_STAFF_ACCOUNT FOREIGN KEY (username) REFERENCES USER(username)
);

CREATE TABLE REPORT(
	id INT NOT NULL AUTO_INCREMENT,
    report_form NVARCHAR(30) NOT NULL,
    fullname NVARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phone_number CHAR(10) NOT NULL,
    content TEXT NOT NULL,
    state NVARCHAR(20) NOT NULL,
    device_id VARCHAR(20),
    image_1 BLOB,
    image_2 BLOB,
    PRIMARY KEY (id),
    CONSTRAINT FK_REPORT_REPORT_FORM FOREIGN KEY (report_form) REFERENCES REPORT_FORM (title),
    CONSTRAINT FK_REPORT_PROCESSING_STATUS FOREIGN KEY (state) REFERENCES PROCESSING_STATUS (title)
);

CREATE TABLE ADS_POSITION(
	id INT NOT NULL AUTO_INCREMENT,
    address NVARCHAR(50) NOT NULL,
    ward NVARCHAR(20) NOT NULL,
    province NVARCHAR(50) NOT NULL,
    district NVARCHAR(20) NOT NULL,
    location_type NVARCHAR(100) NOT NULL,
    ads_form NVARCHAR(30) NOT NULL,
    planning_status NVARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_ADS_POSITION_LOCATION_TYPE FOREIGN KEY (location_type) REFERENCES LOCATION_TYPE (title),
    CONSTRAINT FK_ADS_POSITION_ADS_FORM FOREIGN KEY (ads_form) REFERENCES ADS_FORM (title),
    CONSTRAINT FK_ADS_POSITION_PLANNING_STATUS FOREIGN KEY (planning_status) REFERENCES PLANNING_STATUS (title)
);

CREATE TABLE ADS_PANEL(
	id INT NOT NULL AUTO_INCREMENT,
    ads_type NVARCHAR(50),
    size VARCHAR(20),
    contract_expiration DATE,
    ads_position INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_ADS_PANEL_ADS_TYPE FOREIGN KEY (ads_type) REFERENCES ADS_TYPE (title),
    CONSTRAINT FK_ADS_PANEL_ADS_POSITION FOREIGN KEY (ads_position) REFERENCES ADS_POSITION (id)
);

CREATE TABLE CONTRACT(
	id INT NOT NULL AUTO_INCREMENT,
    enterprise_info TEXT NOT NULL,
    enterprise_email VARCHAR(30) NOT NULL,
    enterprise_phone_number CHAR(10) NOT NULL,
    contract_begin DATE NOT NULL,
    contract_expiration DATE NOT NULL,
    ads_panel INT,
    state NVARCHAR(20) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UC_CONTRACT_ads_panel UNIQUE(ads_panel),
    CONSTRAINT FK_CONTRACT_ADS_PANEL FOREIGN KEY (ads_panel) REFERENCES ADS_PANEL (id),
    CONSTRAINT FK_CONTRACT_INSTALLING_STATUS FOREIGN KEY (state) REFERENCES INSTALLING_STATUS (title)
);

CREATE TABLE ADS_IMAGES(
	id INT NOT NULL AUTO_INCREMENT,
	ads_panel INT NOT NULL,
    ads_image VARCHAR(2083) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_ADS_IMAGES_ADS_PANEL FOREIGN KEY (ads_panel) REFERENCES ADS_PANEL (id)
);

CREATE TABLE EDITING_REQUIREMENT(
	id INT NOT NULL AUTO_INCREMENT,
    new_info TEXT NOT NULL,
	time_submit TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason TEXT NOT NULL,
    state NVARCHAR(20) NOT NULL,
    ads_panel INT,
    PRIMARY KEY (id),
    CONSTRAINT FK_EDITING_REQUIREMENT_PROCESSING_STATUS FOREIGN KEY (state) REFERENCES PROCESSING_STATUS (title),
    CONSTRAINT FK_EDITING_REQUIREMENT_ADS_PANEL FOREIGN KEY (ads_panel) REFERENCES ADS_PANEL (id)
);