/* -- first class function examples -- */
const fortyTwo = () => 42;
const fortyTwos = [42, () => 42];
const createdFromFn = 42 + (() => 42)();
const weirdAdd = (number, fn) => number + fn();
weirdAdd(42, () => 42); //=> 42

/* -- paradigms -- */
{
  /* imperative */
  let lyrics = [];
  for (let bottles = 99; bottles > 0; --bottles) {
    lyrics.push(`${bottles} bottles of beer on the wall`);
    lyrics.push(`${bottles} of beer`);
    lyrics.push("Take one down pass it around");
    if (bottles > 1) {
      /* lyric for next execution of loop */
      lyrics.push((bottles - 1) + " bottles of beer on the wall");
    } {
      lyrics.push("No more bottles of beer on the wall!");
    }
  }
}

{
  /* functional */
  function range(start, end, reverse = false) {
    if (start > end) return range(end, start, true);
    // not very functional... but if a tree falls in the woods
    // and no one hears it does it still make a noise?
    var a = [];
    for(; start <= end; ++start) {
      a.push(start);
    }
    return reverse ? a.reverse() : a;
  }

  function lyricSegement(n) {
    const lyrics = [
      `${n} bottles of beer on the wall`,
      `${n} bottles of beer`,
      "Take one down pass it around"
    ];
    return lyrics.concat(n > 1
      ? `${n - 1} bottles of beer on the wall`
      : "No more bottles of beer on the wall!"
    );
  }
  
  function song(start, end, lyricGenerator) {
    return range(start, end)
      .reduce(
        (lyrics, n) => lyrics.concat(lyricGenerator(n)),
        []
      ); 
  }
  const lyrics = song(99, 0, lyricSegement);
  let pause = "";
}

var pause = "";