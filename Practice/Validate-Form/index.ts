// workaround typing for global jquery
declare var $ : any;

// Higher Order Functions
const not = (pred: (n:any) => boolean) => (n:any) => !pred(n);
const matches = (regex: RegExp) : ((n: string) => boolean) => (n: string) => regex.test(n);

// validators
const nullOrEmpty = (s: string) : boolean => s === "" || s === null;
const exists = (n: any) : boolean => typeof n !== 'undefined';

const required = (val: any) : boolean => [
  exists,
  not(nullOrEmpty)
].every(pred => pred(val));

const digits = n => matches(new RegExp(`^\\d{${n}}$`));

type ElementMap<T> = {
  memberNumber: T,
  birthYear: T,
  birthDay: T
};

const selectors : ElementMap<string> = {
  memberNumber: '#memberNumber',
  birthYear: '#birthYear',
  birthDay: '#birthDay'
};

type validator = (n : any) => boolean;

const rules : ElementMap<validator[]> = {
  memberNumber: [required, digits(9)],
  birthDay: [required],
  birthYear: [required]
};

const runValidation = () : boolean => Object
  .keys(selectors)
  .every(key => {
    const val = $(selectors[key]).val();
    return rules[key].every(rule => rule(val));
  });

$("#theForm").submit(runValidation);