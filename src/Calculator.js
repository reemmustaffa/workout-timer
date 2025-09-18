import { memo, useEffect, useState } from "react";
import clickSound from "./ClickSound.m4a";

const Calculator = memo(function Calculator({ workouts, allowSound }) {
  const [number, setNumber] = useState(workouts.at(0).numExercises);
  const [sets, setSets] = useState(3);
  const [speed, setSpeed] = useState(90);
  const [durationBreak, setDurationBreak] = useState(5);
  const [duration, setDuration] = useState(0);

  //انا عملت كدا مع انه مش احسن استخدام بس لان كنت هعدل في 4 ايفينت هاندلر
  useEffect(
    function () {
      setDuration((number * sets * speed) / 60 + (sets - 1) * durationBreak);
    },
    [number, sets, speed, durationBreak]
  );

  //دي انا عملاها عشان تشغل الصوت فقط لما اعدل غي الديوريشن او في allowsound
  useEffect(
    function () {
      //helper function
      const playSound = function () {
        if (!allowSound) return;
        const sound = new Audio(clickSound);
        sound.play();
      };
      playSound();
    },
    [duration, allowSound]
  );

  const mins = Math.floor(duration);
  const seconds = (duration - mins) * 60;

  function handleInc() {
    setDuration((duration) => Math.floor(duration) + 1);
  }
  function handleDec() {
    setDuration((duration) => (duration > 0 ? Math.ceil(duration) - 1 : 0));
  }

  // 🔹 إيه هو stale closure؟

  //معناه إن جوه دالة/Effect بتستخدم قيمة من state أو props، بس القيمه دي اتغيرت بعدين، والـ closure (النسخة اللي اتحبست وقت إنشاء الدالة) لسه شايل القيمة القديمة.

  useEffect(
    function () {
      console.log(duration, sets);
      document.title = `Your ${number}-exersice workout`;
    },
    [number, duration, sets]
  );

  return (
    <>
      <form>
        <div>
          <label>Type of workout</label>
          <select value={number} onChange={(e) => setNumber(+e.target.value)}>
            {workouts.map((workout) => (
              <option value={workout.numExercises} key={workout.name}>
                {workout.name} ({workout.numExercises} exercises)
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>How many sets?</label>
          <input
            type="range"
            min="1"
            max="5"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />
          <span>{sets}</span>
        </div>
        <div>
          <label>How fast are you?</label>
          <input
            type="range"
            min="30"
            max="180"
            step="30"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
          <span>{speed} sec/exercise</span>
        </div>
        <div>
          <label>Break length</label>
          <input
            type="range"
            min="1"
            max="10"
            value={durationBreak}
            onChange={(e) => setDurationBreak(e.target.value)}
          />
          <span>{durationBreak} minutes/break</span>
        </div>
      </form>
      <section>
        <button onClick={handleDec}>–</button>
        <p>
          {mins < 10 && "0"}
          {mins}:{seconds < 10 && "0"}
          {seconds}
        </p>
        <button onClick={handleInc}>+</button>
      </section>
    </>
  );
});

export default Calculator;
