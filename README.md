# Some random application that transcribes audio files to text

Part of Provisioning and Deployment of PA2577 at BTH.

## Services

| Service             | Language   | Description                                 |
| ------------------- | ---------- | ------------------------------------------- |
| [App](/app)         | TypeScript | React frontend application powered by Astro |
| [Whisper](/whisper) | Python     | Speech-to-text service                      |
| [Database](/mysql)  | MySQL      | Database                                    |

Deployed using Kubernetes, all configuration files are located in the [k8s](/k8s) directory.

### App

The frontend application is a React application written in TypeScript. It uses [Tailwind CSS](https://tailwindcss.com/) for styling.

It uses Astro as a server-side rendering framework to fetch data from the database and render the React application on the server, before hydrating on the client.

### Whisper

A FastAPI web server that runs whisper jobs in a background thread using asyncio and thread pool executors. It's configured to run a single job at a time, and relies on the internals of asyncio to queue jobs as they come in.

The model used is the base whisper model, so transcriptions aren't 100% accurate. A bigger model could be used to improve accuracy at the cost of time and resources. More threads could also be allocated to run in parallel if the underlying hardware supports it, but scaling is primarily done by running multiple replicas of the whisper service.
