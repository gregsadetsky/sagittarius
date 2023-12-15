# A Remake of the Google Gemini Fake Demo, Except Using GPT-4 and It's Real

[Original video here](https://www.youtube.com/watch?v=__nL7Vc0OCg).

[Heads-to-heads comparison of Gemini Pro and GPT-4](https://www.youtube.com/watch?v=1RrkRA7wuoE).

## how to build

- clone this repo, cd into it
- duplicate `.env.example` and name the copy `.env`
- fill out the `VITE_OPENAI_KEY=` value with your OpenAI api key. you must have access to the `gpt-4-vision-preview` model
  - you can also try out the Gemini API if you have a key -- fill out `VITE_GEMINI_KEY` in the same `.env`
- then, run:
- `npm install`
- `npm run dev`
- the demo will be running at [http://localhost:5173](http://localhost:5173)

note: the in-browser speech recognition works best in Google Chrome

## TODO

- [ ] allow input of API keys as `<input>` on the page
- [ ] deploy frontend to site i.e. sagittarius.greg.technology via vite+github actions
- [ ] enable streaming output..!
- [ ] make new video with 1) uses of repo in the wild / forks 2) UI improvements 3) streaming output / comparison
- [ ] enable selection of dictation language
- [ ] add allcontributors bot
- [ ] add dependabot
