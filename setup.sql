CREATE USER ppescorenode WITH PASSWORD='int BABA();'

EXECUTE sp_addrolemember db_datareader, "ppescorenode"
EXECUTE sp_addrolemember db_datawriter, "ppescorenode"

CREATE TABLE users
(
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(255),
    email NVARCHAR(255)
);

SELECT * FROM users

CREATE TABLE zones
(
    id INT IDENTITY PRIMARY KEY,
    zoneName NVARCHAR(255),
    ppe1 INT,
    ppe2 INT,
    ppe3 INT,
    ppe4 INT,
    ppe5 INT
);

INSERT INTO zones (zoneName, ppe1, ppe2, ppe3, ppe4, ppe5) VALUES ('Boiler Plant', 1, 1, 0, 0, 1)
INSERT INTO zones (zoneName, ppe1, ppe2, ppe3, ppe4, ppe5) VALUES ('Furnace', 1, 1, 1, 1, 1)
INSERT INTO zones (zoneName, ppe1, ppe2, ppe3, ppe4, ppe5) VALUES ('Lobby', 0, 0, 0, 0, 1)

SELECT * FROM zones

CREATE TABLE ppe
(
    id INT IDENTITY PRIMARY KEY,
    ppeName VARCHAR(255)
);

SELECT * from ppe

INSERT INTO ppe (ppeName) VALUES ('Goggles')
INSERT INTO ppe (ppeName) VALUES ('Face Mask')
INSERT INTO ppe (ppeName) VALUES ('Gloves')
INSERT INTO ppe (ppeName) VALUES ('Shoes')

CREATE TABLE operator
(
    id INT IDENTITY PRIMARY KEY,
    operatorName NVARCHAR(255),
    lastContactTime INT,
    connectionStatus INT, 
    complianceStatus INT,
    zoneID INT,
    ppe1Status INT,
    ppe2Status INT,
    ppe3Status INT,
    ppe4Status INT,
    ppe5Status INT
);

INSERT INTO operator (operatorName, zoneID, ppe1Status, ppe2Status, ppe3Status, ppe4Status, ppe5Status) VALUES ('Sagar', 1, 1, 1, 1, 1, 1)
INSERT INTO operator (operatorName, zoneID, ppe1Status, ppe2Status, ppe3Status, ppe4Status, ppe5Status) VALUES ('Hari', 2, 1, 1, 1, 1, 1)

IF EXISTS (SELECT 1 FROM operator where id=9)
UPDATE operator SET operatorName='VidyaSagar', zoneID=2, ppe1Status=1, ppe2Status=1, ppe3Status=1, ppe4Status=1, ppe5Status=1 where id=1
ELSE
INSERT INTO operator (operatorName, zoneID, ppe1Status, ppe2Status, ppe3Status, ppe4Status, ppe5Status) VALUES ('Sagar2', 1, 1, 1, 1, 1, 1)

SELECT * FROM operator

SELECT * FROM operator where id=1

DELETE FROM operator

DROP TABLE operator