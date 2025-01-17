# classMA+E
classMA+E is a personal assignment-planning app that works with the Blackboard API to retrieve a student's active assignments, quizzes, announcements, and more. Information will be displayed concisely in two easily-digestible formats that the user can switch between, and the user can add tasks or mark them as complete at any time. In addition, the user will be able to retrieve their assignment grades and use them as part of a fully functional grade calculator, and change settings including the app's appearance, their contact information, and the types of notifications they wish to receive.

All information about the project can be found on the repository's wiki. In particular:
- Information about the planned views of the app can be found [here](https://github.com/SCCapstone/Group16/wiki/Architecture).
- Up-to-date information about app architecture can be found [here](https://github.com/SCCapstone/Group16/wiki/Design).

## Access
Website: classmate.osterholt.us

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
After cloning or pulling from the repository, ensure that you have all of the necessary packages by navigating to the `fe-app` folder running `npm install`.
After you've installed the necessary packages, you can start the app locally by running `./start` in the `Group16` directory. If you are in VS Code you can open **Run and Debug** pane (`control+shift+d`) and click play.
To visit the app, open your web browser and navigate to the URL `localhost:4200`.
While running, you can enter 'q' in the CLI to quit or 'h' to display a list of options.

## Deployment
The app will be deployed on Cam's personal server with a static IP. 
It will be deployed using Kubernetes to spin up Docker images depending on the number of users. 
Our app will connect to the front end using Java Spring (more research will continue to evolve this step, we have recently added Java Spring after a meeting with Dr. Vidal).

## Authors
Ava Turner - AVART@email.sc.edu
Cam Osterholt - OSTERHOC@email.sc.edu
Cayden Scruggs - CSCRUGGS@email.sc.edu
Fred Schein - FSCHEIN@email.sc.edu
Michael Pikula - MPIKULA@email.sc.edu
