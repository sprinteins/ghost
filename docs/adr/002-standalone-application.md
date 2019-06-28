# 2. Creating a standalone application

Date 7. February 2019

## Status:

accepted

## Context:

"ghost" will be developed to be used in several projects. Thus it must comply to every requirement these projects will come up with. One of the known requirements is, that projectcode should not be transmitted to foreign surveyors or in unnecessary manners.

## Decision:

"ghost" will be developed as a standalone application, that works locally and without transmittion to a foreign webserver or anything alike.

## Consequences:

The application will be on the local machine, thus it must be downloaded. The versioninglogs will not be transmitted over net, to minimize threat of publication and to comply with requirement
