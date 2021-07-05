-- add an 'endDate' column to the txcOperatorLine as part of CFD-337
alter table txcOperatorLine add column endDate date default null;
