# TG Report

TG Report is a simple Telegram bot that allows users to submit reports via a web interface. The bot sends the submitted reports, along with any attached proof, to a specified Telegram chat.

## Features

- Submit reports with details like name, email, type, and message.
- Optionally attach proof in the form of images, videos, or documents.
- Cooldown mechanism to prevent spam submissions.
- Responsive and visually appealing frontend with animations.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/notsopreety/tg-report
   cd tg-report
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```env
   PORT=3000
   BOT_TOKEN=<your-telegram-bot-token>
   CHAT_ID=<your-telegram-chat-id>
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. Fill out the form on the web interface.
2. Optionally attach proof (images, videos, or documents).
3. Submit the form to send the report to the Telegram chat.

## Dependencies

- [Express](https://expressjs.com/)
- [Multer](https://github.com/expressjs/multer)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Anime.js](https://animejs.com/)

## License

This project is licensed under the MIT License. See the LICENSE file for details.
