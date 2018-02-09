declare var document: any;
declare var setTimeout: any;

import { R, RahRah } from "../lib/rah-rah";

function addDiv(text: string): void {
  let el = document.createElement("div");
  el.innerHTML = text;
  document.body.appendChild(el);
}

async function resolveIt(val: string, wait: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => resolve(val), wait);
  });
}

async function rejectIt(val: string, wait: number): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    setTimeout(() => reject(val), wait);
  });
}

async function newResolve(): Promise<any> {
  // NOTE: we're wrapping with `R`
  let result = await R(resolveIt("resolved", 1000));

  // Using `withDefault`
  addDiv(result.map(z => z.toUpperCase()).withDefault("default string if failed"));
}

async function newReject(): Promise<any> {
  // NOTE: the `R` above is just shorthand for `RahRah.lift`
  let result = await RahRah.lift(rejectIt("rejected", 1500));

  // Extracting the actual values
  if (result.good) {
    addDiv(result.yay);
  } else {
    addDiv("" + result.boo);
  }
}

async function oldResolve(): Promise<any> {
  // mimicking `withDefault`
  try {
    let result = await resolveIt("old resolve", 2000);
    addDiv(result.toUpperCase());
  } catch (_) {
    addDiv("default string if failed");
  }
}

async function oldReject(): Promise<any> {
  try {
    let result = await rejectIt("old reject", 2500);
    addDiv(result);
  } catch (e) {
    addDiv("" + e);
  }
}

Promise.all([newResolve(), newReject(), oldResolve(), oldReject()]);
