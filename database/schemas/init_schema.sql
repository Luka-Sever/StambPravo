-- schema ver 1.0

-- create user table
CREATE TABLE COOWNER (
	CoOwnerId SERIAL PRIMARY KEY,
	Username VARCHAR(20) NOT NULL UNIQUE,
	PasswordHash VARCHAR(100) NOT NULL,
	FirstName VARCHAR(20) NOT NULL,
	LastName VARCHAR(20) NOT NULL,
	Email VARCHAR(100) NOT NULL UNIQUE,
	RoleType VARCHAR(20) NOT NULL,
	BuildingId INTEGER NOT NULL
);

-- create city table
CREATE TABLE CITY (
	CityId SERIAL PRIMARY KEY,
	PostalCode INTEGER NOT NULL UNIQUE,
	CityName VARCHAR(50) NOT NULL
);

-- create building table
CREATE TABLE BUILDING (
	BuildingId SERIAL PRIMARY KEY,
	CityId INTEGER NOT NULL REFERENCES CITY(CityId),
	Address VARCHAR(100) NOT NULL,
	RepId INTEGER UNIQUE,
	CONSTRAINT city_address UNIQUE (CityId, Address)
);

-- assign foreign key references
ALTER TABLE COOWNER
	ADD CONSTRAINT fk_coowner_building FOREIGN KEY (BuildingId) REFERENCES BUILDING(BuildingId);
ALTER TABLE BUILDING
	ADD CONSTRAINT fk_building_rep FOREIGN KEY (RepId) REFERENCES COOWNER(CoOwnerId);

-- create indexes
CREATE INDEX i_coowner_by_building ON COOWNER (BuildingId);
CREATE INDEX i_building_by_rep ON BUILDING (RepId);
