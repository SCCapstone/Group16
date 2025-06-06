# classMA+E

classMA+E is a personal assignment-planning app that will work with the Blackboard API to retrieve a student's active assignments, quizzes, announcements, and more. Information will be displayed concisely in two easily-digestible formats that the user can switch between, and the user can add tasks or mark them as complete at any time. In addition, the user will be able to retrieve their assignment grades and use them as part of a fully functional grade calculator, and change settings including the app's appearance, their contact information, and the types of notifications they wish to receive.

All information about the project can be found on the repository's wiki. In particular:

- Information about the planned views of the app can be found [here](https://github.com/SCCapstone/Group16/wiki/Architecture).
- Up-to-date information about app architecture can be found [here](https://github.com/SCCapstone/Group16/wiki/Design).

## Access

Website: [classmate.osterholt.us](https://classmate.osterholt.us/)

## External Requirements

To run this project locally, you will need to install Node.js, the Angular Command Line Interface, and JDK.
A walkthrough for installing Node & Angular can be found on [Angular's Website](https://angular.dev/tools/cli/setup-local).
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

The app is deployed on a remote server rented by Cam. On each push to main, a Github action builds both our Angular project and Springboot backend with the Dockerfiles to containers stored in the Github Container Registry. From there, the server's Kubernetes manager, Minikube, pulls down the new container and runs in in 6 different nodes. The routing for the server is configured using Nginx with certificates to allow an HTTPS connection. In RC1, any push to main will also SSH into the server to toggle the K8s pods to rebuild with the new image.

## Testing

Our testing is best done in Visual Studio Code.

- Front End Unit Testing: You must have Chrome installed to run the FE tests. Once installed, run `ng test` in the `/src/fe-app` directory.
- Back End Unit Testing: In the testing pannel hit play on `be` tab under `Java Test`. Unit tests will soon be deployed in RC1 in each PR before merging to main.
- Behavioral Testing: In the `/src/fe-app` directory, run `npx playwright install` to install Playwright. Once installed, run tests from the same directory using `npx playwright test`.

## Authors

- Ava Turner - <AVART@email.sc.edu> (www.linkedin.com/in/avaturner03)
- Cam Osterholt - <OSTERHOC@email.sc.edu> (www.linkedin.com/in/camosterholt/)
- Cayden Scruggs - <CSCRUGGS@email.sc.edu> (www.linkedin.com/in/cayden-scruggs-a76a3326b/)
- Fred Schein - <FSCHEIN@email.sc.edu> (www.linkedin.com/in/fschein/)
- Michael Pikula - <MPIKULA@email.sc.edu> (www.linkedin.com/in/michaelpikula/)
