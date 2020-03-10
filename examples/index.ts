declare var document: any;
declare var setTimeout: any;

import { R, RahRah } from "../lib/rah-rah";

function addDiv(text: string): void {
  let el = document.createElement("div");
  el.innerHTML = text;
  document.body.appendChild(el);
}

// Resolve the passed-in 'val' after 'wait' milliseconds
async function resolveIt(val: string, wait: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => resolve("" + wait + "ms: resolved with " + val), wait);
  });
}

// Reject the passed-in 'val' after 'wait' milliseconds
async function rejectIt(val: string, wait: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => reject("" + wait + "ms: rejected with " + val), wait);
  });
}

async function resolveWithRahRah(wait: number): Promise<any> {
  // Wrap the resolving function with R()
  let result = await R(resolveIt("RahRah", wait));

  // Map only the success value into Uppercase & provide a default using `withDefault`
  const output = result
    .map(z => z.toUpperCase())
    .withDefault("default string if failed");

  addDiv(output);
}

async function rejectWithRahRah(wait: number): Promise<any> {
  // NOTE: the `R` above is just shorthand for `RahRah.lift`
  let result = await RahRah.lift(rejectIt("RahRah", wait));

  // Extracting the actual values
  if (result.good) {
    addDiv(result.yay);
  } else {
    addDiv("" + result.boo);
  }
}

async function resolveWithTryCatch(wait: number): Promise<any> {
  // mimicking `withDefault`
  let result;
  try {
    const resolved = await resolveIt("try/catch", wait);
    result = resolved.toUpperCase();
  } catch (_) {
    result = "default string if failed";
  }
  addDiv(result);
}

async function rejectWithTryCatch(wait: number): Promise<any> {
  let result;
  try {
    result = await rejectIt("try/catch", wait);
  } catch (e) {
    result = "" + e;
  }
  addDiv(result);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('go').addEventListener('click', () => {
    addDiv('started!');
    Promise.all([
      resolveWithRahRah(500),
      rejectWithRahRah(1000),
      resolveWithTryCatch(1500),
      rejectWithTryCatch(2000),
    ]).then(() => addDiv('finished!'))
  });
});
