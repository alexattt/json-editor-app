# JSON editor app

Purpose of this app is to provide real time collaboration - JSON file editing -, as well as it allows to download the JSON file user is currently editing
to their local machine. </br>

The frontend part is in the ./src directory, it is a React app (Vite) with shadcn/ui components (wonderful library).
To run frontend, write npm run dev in console. </br>

The backend part is in the ./server directory. It is an Express server, for real-time collaboration Socket.io is being used.
Data is stored in Mongo DB. To run backend server, go in ./server directory and write npm start. </br>

For text editor I chose to use React Ace (https://www.npmjs.com/package/react-ace). Easy to use, good looking editor. 
Has support for json syntax highlighting. </br>
