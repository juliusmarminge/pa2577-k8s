# Some random application that transcribes audio files to text

Part of Provisioning and Deployment of PA2577 at BTH.

## Services

| Service             | Language   | Description                                   |
| ------------------- | ---------- | --------------------------------------------- |
| [App](/app)         | TypeScript | React frontend application powered by Next.js |
| [Whisper](/whisper) | Python     | Speech-to-text service                        |
| [Database](/mysql)  | MySQL      | Database                                      |

Deployed using Kubernetes, all configuration files are located in the [k8s](/k8s) directory.

### App

The frontend application is a React application written in TypeScript. It uses [Tailwind CSS](https://tailwindcss.com/) for styling.

It uses Next.js as a server-side rendering framework to fetch data from the database and render the React application on the server, before hydrating on the client.

It has support to upload audio files, as well as record new ones (doesn't work in our k8s deployment as it's still on HTTP and no SSL which is required for the browser to allow microphone access). The files are then sent to the whisper service for transcription.

### Whisper

A FastAPI web server that runs whisper jobs in a background thread using asyncio and thread pool executors. It's configured to run a single job at a time, and relies on the internals of asyncio to queue jobs as they come in.

The model used is the base whisper model, so transcriptions aren't 100% accurate. A bigger model could be used to improve accuracy at the cost of time and resources. More threads could also be allocated to run in parallel if the underlying hardware supports it, but scaling is primarily done by running multiple replicas of the whisper service.

### Database

Very basic MySQL database which stores the transcription results. It's not exposed to the outside world, and is only accessible from within the cluster.

## Deployment

The application is deployed using Kubernetes, and all configuration files are located in the [k8s](/k8s) directory.

```bash
# From project root
kubectl apply -f k8s/mysql.yaml -f k8s/whisper.yaml -f k8s/app.yaml
./db-init.sh
```
