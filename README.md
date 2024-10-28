# Blackboard Buddy (working name)
Blackboard Buddy is a personal assignment-planning app that works with the Blackboard API to retrieve a student's active assignments, quizzes, announcements, and more. Information will be displayed concisely in two easily-digestible formats that the user can switch between, and the user can add tasks or mark them as complete at any time. In addition, the user will be able to retrieve their assignment grades and use them as part of a fully functional grade calculator, and change settings including the app's appearance, their contact information, and the types of notifications they wish to receive.

All information about the project can be found on the repository's wiki. In particular:
- Information about the planned views of the app can be found [here](https://github.com/SCCapstone/Group16/wiki/Architecture).
- Up-to-date information about app architecture can be found [here](https://github.com/SCCapstone/Group16/wiki/Design).

## External Requirements
To run this project, you will need to install Node.js and the Angular Command Line Interface.
A walkthrough for installing both can be found on [Angular's Website](https://angular.dev/tools/cli/setup-local).
The walkthrough also contains basic commands you can use to get started on a project.

## Setup
To set up your environment to run this repository locally you will need:
Node.js version 22.9.0 
npm version 10.8.3
Angular CLI version 18.2.7

## Running
After cloning or pulling from the repository, ensure that you have all of the necessary packages by running `npm install`.
After you've installed the necessary packages, you can start the app locally by navigating to the `fe-app` folder and running `ng serve`.
To visit the app, open your web browser and navigate to the URL `localhost:4200`.
While running, you can enter 'q' in the CLI to quit or 'h' to display a list of options.

## Deployment
The app will be deployed on Cam's personal server with a static IP. 
It will be deployed using Kubernetes to spin up Docker images depending on the number of users. 
Our app will connect to the front end using Java Spring (more research will continue to evolve this step, we have recently added Java Spring after a meeting with Dr. Vidal).

## Authors
Ava Turner - AVART@email.sc.edu
Cam Osterholt - OSTERHOC@email.sc.edu
Cayden Scruggs - 
Fred Schein - FSCHEIN@email.sc.edu
Michael Pikula - MPIKULA@email.sc.edu



[//]: # Once we get to unit tests in 492, we will likely have to include Testing, Testing Technology, and Running Tests sections from template.

### Previous info, safe to delete?
mvn --version:
Apache Maven 3.9.9 (8e8579a9e76f7d015ee5ec7bfcdc97d260186937)
Java version: 22.0.2, vendor: Homebrew, runtime: /opt/homebrew/Cellar/openjdk/22.0.2/libexec/openjdk.jdk/Contents/Home
Default locale: en_US, platform encoding: UTF-8
