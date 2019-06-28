# 3. Setting project structure

Date 7. February 2019

## Status:

accepted

## Context:

For easier development, an unambiguously folderstructure is needed. This is, to identify the affiliation of files to certain tasks, like testing, creating the UI or logic.

## Decision:

Folderstructure should be separated into at least the folders src (for the application code) and test (for testing). Further more, the src-folder should be separated into a module-folder that keeps the logical parts of the application, and a view-folder, that houses the interface-related parts of the code.

## Consequences:

Through this decision, it should be easier for developers to identify file allegiance and navigation through the codebase. that should proof helpfull for implementing new features or fixing bugs
