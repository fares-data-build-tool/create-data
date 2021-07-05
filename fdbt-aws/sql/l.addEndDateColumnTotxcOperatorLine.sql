-- add an 'endDate' column to the txcOperatorLine as part of CFD-337
ALTER TABLE txcOperatorLine ADD COLUMN endDate DATE DEFAULT NULL;
