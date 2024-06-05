const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const videoPath = 'video.mp4';

exec(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error al obtener la duración: ${error}`);
    return;
  }

  const totalDuration = parseFloat(stdout);
  generateRandomClips(totalDuration);
});

function generateRandomClips(totalDuration) {
  const clipDuration = 30;
  const numClips = 10;
  const startTimes = [];

  while (startTimes.length < numClips) {
    const startTime = Math.floor(Math.random() * (totalDuration - clipDuration));
    if (!startTimes.includes(startTime) && !startTimes.some(time => Math.abs(time - startTime) < clipDuration)) {
      startTimes.push(startTime);
    }
  }

  cutVideoClips(startTimes, clipDuration);
}

async function cutVideoClips(startTimes, clipDuration) {
  const promises = [];

  for (const startTime of startTimes) {
    const clipName = `clip_${startTimes.indexOf(startTime)}`;
    const clipFolder = `clips/${clipName}`;
    const videoOutputPath = `${clipFolder}/${clipName}.mp4`;
    const audioOutputPath = `${clipFolder}/${clipName}.wav`;
    const startTimeString = formatTime(startTime);
    const endTimeString = formatTime(startTime + clipDuration);

    // Crear la carpeta para el clip
    fs.mkdirSync(clipFolder, { recursive: true });

    // Cortar el video y separar el audio
    const videoCommand = `ffmpeg -ss ${startTimeString} -i "${videoPath}" -t ${clipDuration} -c:v libx264 -vf "crop=ih*9/16:ih" -aspect 9:16 "${videoOutputPath}"`;
    const audioCommand = `ffmpeg -ss ${startTimeString} -i "${videoPath}" -t ${clipDuration} -vn -acodec pcm_s16le -ar 44100 -ac 2 "${audioOutputPath}"`;

    const videoPromise = execPromise(videoCommand);
    const audioPromise = execPromise(audioCommand).then(() => generateSubtitles(audioOutputPath, clipName));

    promises.push(videoPromise, audioPromise);
  }

  try {
    await Promise.all(promises);
  } catch (error) {
    console.error('Error durante el procesamiento:', error);
  }
}

async function generateSubtitles(audioPath, clipName) {
  const subtitleSrtPath = `clips/${clipName}/subtitulos.srt`;
  const srtCommand = `whisper "${audioPath}" --model medium --task transcribe --language es --output_format srt`;

  try {
    const { stdout, stderr } = await execPromise(srtCommand, { encoding: 'utf8' });

    // Procesar la salida de stderr para mostrar el progreso
    stderr.split('\n').forEach(line => {
      const progressMatch = line.match(/(\d+)%\s+\d+\/\d+/);
      if (progressMatch) {
        console.log(`Progreso de transcripción: ${progressMatch[1]}%`);
      }
    });

    fs.writeFileSync(subtitleSrtPath, stdout);
    console.log(`Subtítulos SRT guardados como ${subtitleSrtPath}`);
  } catch (error) {
    console.error(`Error al generar subtítulos: ${error}`);
  }
}

function formatTime(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}