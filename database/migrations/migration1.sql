-- migration 1 ver 1.0

CREATE TABLE MEETING (
	meeting_id SERIAL PRIMARY KEY,
	status VARCHAR(20) NOT NULL,
	meeting_start_time TIMESTAMP NOT NULL,
	meeting_end_time TIMESTAMP,
	meeting_location VARCHAR(100) NOT NULL,
	title VARCHAR(50) NOT NULL,
	summary VARCHAR(500) NOT NULL,
	building_id INTEGER NOT NULL REFERENCES BUILDING(building_id),
	CONSTRAINT time_space UNIQUE (meeting_start_time, meeting_location),
	CONSTRAINT building_time UNIQUE (meeting_start_time, building_id)
);

CREATE TABLE ITEM (
	meeting_id INTEGER NOT NULL REFERENCES MEETING(meeting_id),
	item_number INTEGER NOT NULL,
	title VARCHAR(50) NOT NULL,
	summary VARCHAR(500) NOT NULL,
	legal INTEGER NOT NULL,
	conclusion VARCHAR(500),
	status VARCHAR(20),
	CONSTRAINT pk_item PRIMARY KEY (meeting_id, item_number),
	CONSTRAINT item_title UNIQUE (meeting_id, title)
);

CREATE TABLE PARTICIPATION (
	meeting_id INTEGER NOT NULL REFERENCES MEETING(meeting_id),
	co_owner_id INTEGER NOT NULL REFERENCES CO_OWNER(co_owner_id),
	CONSTRAINT pk_part PRIMARY KEY (meeting_id, co_owner_id)
);

CREATE INDEX i_meeting_by_building ON MEETING (building_id);
CREATE INDEX i_part_by_coowner ON PARTICIPATION (co_owner_id);
