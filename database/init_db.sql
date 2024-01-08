CREATE DATABASE ads_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ads_management;

/*
	Generate some enums
*/

CREATE TABLE PROCESSING_STATUS(
	title NVARCHAR(20),
    color VARCHAR(10),
    icon VARCHAR(5),
    PRIMARY KEY (title)
);
INSERT INTO PROCESSING_STATUS VALUES ('Đã gửi', 'blue', '📩');
INSERT INTO PROCESSING_STATUS VALUES ('Đang xử lý', 'yellow', '✍️');
INSERT INTO PROCESSING_STATUS VALUES ('Đã xử lý', 'green', '⌛');

CREATE TABLE PLANNING_STATUS(
	title NVARCHAR(20),
    color VARCHAR(10),
    icon VARCHAR(5),
    PRIMARY KEY (title)
);
INSERT INTO PLANNING_STATUS VALUES ('Đã quy hoạch', 'green', '👍');
INSERT INTO PLANNING_STATUS VALUES ('Đang quy hoạch', 'yellow', '🚧');
INSERT INTO PLANNING_STATUS VALUES ('Chưa quy hoạch', 'red', '❗');

CREATE TABLE INSTALLING_STATUS(
	title NVARCHAR(20),
    color VARCHAR(10),
    icon VARCHAR(5),
    PRIMARY KEY (title)
);
INSERT INTO INSTALLING_STATUS VALUES ('Chờ duyệt', 'blue', '🔃');
INSERT INTO INSTALLING_STATUS VALUES ('Đang hiện diện', 'green', '✔️');
INSERT INTO INSTALLING_STATUS VALUES ('Đã hết hạn', 'red', '❌');

CREATE TABLE REPORT_FORM(
	title NVARCHAR(30),
    color VARCHAR(10),
    icon VARCHAR(5),
    PRIMARY KEY (title)
);
INSERT INTO REPORT_FORM VALUES ('Tố giác sai phạm', 'red', '📞');
INSERT INTO REPORT_FORM VALUES ('Đăng ký nội dung', 'white', '📝');
INSERT INTO REPORT_FORM VALUES ('Đóng góp ý kiến', 'grey', '📬');
INSERT INTO REPORT_FORM VALUES ('Giải đáp thắc mắc', 'yellow', '✏️');

CREATE TABLE ADS_FORM(
	title NVARCHAR(30),
    color VARCHAR(10),
    icon VARCHAR(5),
    PRIMARY KEY (title)
);
INSERT INTO ADS_FORM VALUES ('Cổ động chính trị', 'grey', '🏛️');
INSERT INTO ADS_FORM VALUES ('Quảng cáo thương mại', 'blue', '🏢');
INSERT INTO ADS_FORM VALUES ('Xã hội hoá', 'white', '🏙️');

CREATE TABLE LOCATION_TYPE(
	title NVARCHAR(100),
    color VARCHAR(10),
    icon VARCHAR(5),
    PRIMARY KEY (title)
);
INSERT INTO LOCATION_TYPE VALUES ('Đất công/Công viên/Hành lang an toàn giao thông', 'green', '🌳');
INSERT INTO LOCATION_TYPE VALUES ('Đất tư nhân/Nhà ở riêng lẻ', 'white', '🏠');
INSERT INTO LOCATION_TYPE VALUES ('Trung tâm thương mại', 'grey', '🛒');
INSERT INTO LOCATION_TYPE VALUES ('Chợ', 'yellow', '🍉');
INSERT INTO LOCATION_TYPE VALUES ('Cây Xăng', 'red', '🔥');
INSERT INTO LOCATION_TYPE VALUES ('Nhà chờ xe buýt', 'blue', '🛑');

CREATE TABLE ADS_TYPE(
	title NVARCHAR(50),
    color VARCHAR(10),
    icon VARCHAR(5),
    PRIMARY KEY (title)
);
INSERT INTO ADS_TYPE VALUES ('Trụ bảng hiflex', 'red', '📰');
INSERT INTO ADS_TYPE VALUES ('Trụ màn hình điện tử LED', 'orange', '🚨');
INSERT INTO ADS_TYPE VALUES ('Trụ hộp đèn', 'yellow', '💡');
INSERT INTO ADS_TYPE VALUES ('Bảng hiflex ốp tường', 'green', '💲');
INSERT INTO ADS_TYPE VALUES ('Màn hình điện tử ốp tường', 'blue', '🎫');
INSERT INTO ADS_TYPE VALUES ('Trụ treo băng rôn dọc', 'indigo', '🚩');
INSERT INTO ADS_TYPE VALUES ('Trụ treo băng rôn ngang', 'purple', '🏴');
INSERT INTO ADS_TYPE VALUES ('Trụ/Cụm pano', 'pink', '🔴');
INSERT INTO ADS_TYPE VALUES ('Cổng chào', 'white', '👋');
INSERT INTO ADS_TYPE VALUES ('Trung tâm thương mại', 'grey', '🛒');

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

CREATE TABLE ADS_POSITION(
	id INT NOT NULL AUTO_INCREMENT,
    address NVARCHAR(50) NOT NULL,
    ward NVARCHAR(20) NOT NULL,
    province NVARCHAR(50) NOT NULL,
    district NVARCHAR(20) NOT NULL,
    location_type NVARCHAR(100) NOT NULL,
    ads_form NVARCHAR(30) NOT NULL,
    planning_status NVARCHAR(20) NOT NULL,
    photo VARCHAR(2083),
    place_id VARCHAR(2083),
    latitude DECIMAL(8,8),
    longitude DECIMAL(8,8),
    is_active ENUM('TRUE', 'FALSE') NOT NULL,
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
    staff INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT UC_CONTRACT_ads_panel UNIQUE(ads_panel),
    CONSTRAINT FK_CONTRACT_ADS_PANEL FOREIGN KEY (ads_panel) REFERENCES ADS_PANEL (id),
    CONSTRAINT FK_CONTRACT_INSTALLING_STATUS FOREIGN KEY (state) REFERENCES INSTALLING_STATUS (title),
    CONSTRAINT FK_CONTRACT_STAFF FOREIGN KEY (staff) REFERENCES STAFF (id) ON DELETE CASCADE
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
    staff INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_EDITING_REQUIREMENT_PROCESSING_STATUS FOREIGN KEY (state) REFERENCES PROCESSING_STATUS (title),
    CONSTRAINT FK_EDITING_REQUIREMENT_ADS_PANEL FOREIGN KEY (ads_panel) REFERENCES ADS_PANEL (id),
    CONSTRAINT FK_EDITING_REQUIREMENT_STAFF FOREIGN KEY (staff) REFERENCES STAFF (id) ON DELETE CASCADE
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
    image_1 VARCHAR(2083),
    image_2 VARCHAR(2083),
    ads_position INT,
    ads_panel INT,
    PRIMARY KEY (id),
    CONSTRAINT FK_REPORT_REPORT_FORM FOREIGN KEY (report_form) REFERENCES REPORT_FORM (title),
    CONSTRAINT FK_REPORT_PROCESSING_STATUS FOREIGN KEY (state) REFERENCES PROCESSING_STATUS (title),
    CONSTRAINT FK_REPORT_ADS_POSITION FOREIGN KEY (ads_position) REFERENCES ADS_POSITION (id),
    CONSTRAINT FK_REPORT_ADS_PANEL FOREIGN KEY (ads_panel) REFERENCES ADS_PANEL (id)
);

CREATE TABLE WARD (
    ward VARCHAR(20) NOT NULL,
	PRIMARY KEY (ward)
);
insert into WARD(ward) value ('quận 1');
insert into WARD(ward) value ('quận 2');
insert into WARD(ward) value ('quận 3');
insert into WARD(ward) value ('quận 4');
insert into WARD(ward) value ('quận 5');
insert into WARD(ward) value ('quận 6');


CREATE TABLE DISTRICT (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district VARCHAR(20) NOT NULL,
    ward VARCHAR(20) NOT NULL,
    CONSTRAINT FK_DISTRICT_WARD FOREIGN KEY (ward) REFERENCES WARD (ward)
);

insert into DISTRICT(ward,district) value ('quận 1','Bến Thành');
insert into DISTRICT(ward,district) value ('quận 1','Bến Nghé');
insert into DISTRICT(ward,district) value ('quận 1','Cầu Kho');
insert into DISTRICT(ward,district) value ('quận 1','Cầu Ông Lãnh');
insert into DISTRICT(ward,district) value ('quận 1','Đa Kao');
insert into DISTRICT(ward,district) value ('quận 1','Nguyễn Cư Trinh');
insert into DISTRICT(ward,district) value ('quận 6','Linh Trung');
insert into DISTRICT(ward,district) value ('quận 6','Linh Xuân');
insert into DISTRICT(ward,district) value ('quận 6','Bình Hưng Hòa');
insert into DISTRICT(ward,district) value ('quận 6','Bình Hưng Hòa A');
insert into DISTRICT(ward,district) value ('quận 6','Bình Hưng Hòa B');
insert into DISTRICT(ward,district) value ('quận 6','Tân Thành');
