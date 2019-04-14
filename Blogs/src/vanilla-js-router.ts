// https://vanillajstoolkit.com/helpers/router/

const parseQueryString = (url: string) => {
  const indexOfQuestionMark = url.indexOf('?');
  return indexOfQuestionMark === -1
    ? ''
    : url.slice(indexOfQuestionMark + 1); 
};

const getQueryParams = (queryString: string): { [key: string]: string } => {
  return queryString
    .split('&')
    .map((keyValue: string) => keyValue.split('='))
    .reduce((params: any, [key, value]: [string, string]): any => {
      params[key] = value;
      return params;
    }, Object.create({}))
};

const isParam = (token: string) => token.startsWith(':');

const getKeys = (route: string): string[] => {
  return route
    .split('/')
    .filter(isParam)
    .map(key => key.slice(1));
};

const getPattern = (route: string): string => {
  const pattern = route
    .split('/')
    .map(part => isParam(part) ? '([^/]*)' : part)
    .join('/');
  return `^${pattern}$`;
};

interface UrlData {
  search: { [key: string]: string };
  params: { [key: string]: string };
}

const parseUrl = (route: string, url: string): UrlData | null => {
  const queryString = parseQueryString(url);
  const path = url.replace(`?${queryString}`, '');
  const pattern = new RegExp(getPattern(route));
  const matches = pattern.exec(path);

  if (!matches) {
    return null;
  }

  const search = getQueryParams(queryString);
  const params = getKeys(route).reduce((params: any, key, index) => ({
      ...params,
      [key]: matches[index + 1],
    }), Object.create(null));

  return {
    params,
    search,
  };
};

interface Routes {
  [route: string]: (req: any, res: any) => void;
}

const navigate = (routes: Routes) => (url: string): void => {
  let [path, query] = url.split('?');
  path = path.endsWith('/') ? path : `${path}/`;
  url = `${path}${query ? `?${query}` : ''}`;
  for (let [route, execute] of Object.entries(routes)) {
    route = route.endsWith('/') ? route : `${route}/`;
    const { params, search } = parseUrl(route, url);
    if (params) {
      return execute({ params, search }, {});
    }
  }
}

/*******************************************************************************
  == Test Suite ==
*/

test('parseQueryString', (assert) => {
  {
    const msg = `should return '' if no query string is present`;
    const actual = parseQueryString('/hello/world/');
    const expected = '';
    assert.equal(actual, expected, msg);
  }
  {
    const msg = `should return query string when present`;
    const actual = parseQueryString('/hello/world/?hello=world');
    const expected = 'hello=world';
    assert.equal(actual, expected, msg);
  }
});

test('getQueryParams', (assert) => {
  {
    const msg = `should return empty object if query string is empty`;
    const actual = getQueryParams('');
    const expected = {};
    assert.same(actual, expected, msg);
  }
  {
    const msg = `should return { foo: 'bar' } when passed "foo=bar"`;
    const actual = getQueryParams('foo=bar');
    const expected = { foo: 'bar' };
    assert.same(actual, expected, msg);
  }
  {
    const msg = `should return { foo: 'bar', bah: 'baz' } when passed "foo=bar&bah=baz"`;
    const actual = getQueryParams('foo=bar&bah=baz');
    const expected = { foo: 'bar', bah: 'baz' };
    assert.same(actual, expected, msg);
  }
});

test('getKeys', assert => {
  {
    const msg = `should return keys ['foo', 'bar'] when passed "/:foo/:bar/"`;
    const actual = getKeys('/:foo/:bar/');
    const expected = ['foo', 'bar'];
    assert.same(actual, expected, msg);
  }
  {
    const msg = `should return keys ['hello'] when passed "/:hello/"`;
    const actual = getKeys('/:hello');
    const expected = ['hello'];
    assert.same(actual, expected, msg);
  }
});

test('getPattern', assert => {
  {
    const msg = `should return "^/hello/world/$" when passed "/hello/world/"`;
    const actual = getPattern('/hello/world/');
    const expected = '^/hello/world/$';
    assert.same(actual, expected, msg);
  }
  {
    const msg = `should return "^/([^/]*)/world/$" when passed "/:hello/world/"`;
    const actual = getPattern('/:hello/world/');
    const expected = '^/([^/]*/world/$';
    assert.same(actual, expected, msg);
  }
});

test('parseUrl', assert => {
  {
    const msg = `should return null when url does not match route`;
    const actual = parseUrl('', '/hello/world/');
    const expected: null = null;
    assert.equal(actual, expected, msg);
  }
  {
    const msg = `should return { foo: 'bar' } when passed url = "/hello/bar/" and route = "/hello/:foo/`;
    const { params } = parseUrl('/hello/:foo/', '/hello/bar/');
    assert.same(params, { foo: 'bar' }, msg);
  }
  {
    const msg = `should return { params: { foo: 'bar' }, search: { bah: 'baz' } } when passed url = "/hello/bar/?bah=baz" and route = "/hello/:foo`;
    const { params, search } = parseUrl('/hello/:foo/', '/hello/bar/?bah=baz');
    assert.same(params, { foo: 'bar'}, `params: ${msg}`);
    assert.same(search, { bah: 'baz' },`search: ${msg}`);
  }
  {
    const msg = `should return {} when passed url = "/hello/world/" and route = /hello/world/`;
    const { params, search } = parseUrl('/hello/world/', '/hello/world/');
    const expected = {};
    assert.same(params, expected, msg);
    assert.same(search, expected, msg);
  }
});

test('navigate', assert => {
  {
    let executed = false;
    const routes: Routes = {
      ['/foo'](req: any): void {
        executed = true;
      },
    };
    const navigator = navigate(routes);
    navigator('/foo');

    const msg = `should execute matching route`;
    const actual = executed;
    const expected = true;

    assert.equal(actual, expected, msg);
  }
  {
    const routes: Routes = {
      ['/:foo'](req: any): void {
        const msg = `should bind 'foo: abc' to params object when '/:foo' is matched with '/abc'`;
        assert.equal(req.params.foo, 'abc', msg);
      },
    };
    const navigator = navigate(routes);
    navigator('/abc');
  }
  {
    const routes: Routes = {
      ['/:foo'](req: any): void {
        const msg = `should bind 'bah: baz' as search param when '/:foo' is matched with '/abc?bah=baz`;
        assert.equal(req.search.bah, 'baz', msg);
      }
    }
    navigate(routes)('/abc?bah=baz');
  }
});

/*******************************************************************************
  == Test Framework ==
*/
// First create a little TDD framework,
// src: https://medium.com/javascript-scene/tdd-the-rite-way-53c9b46f45e3

interface TestFramework {
  equal<T>(actual: T, expected: T, msg: string): void;
  same<T>(actual: T, expected: T, msg: string): void;
}

function test(component: string, fn: (assert: TestFramework) => void, count: number = 1): void {
  console.log(`# ${component}`);

  const isObject = (x: any): boolean => typeof x === 'object' && x !== null && !Array.isArray(x);

  fn({
    equal<T>(actual: T, expected: T, msg: string): void {
      if (actual === expected) {
        console.log(`ok ${count} - ${msg}`);
      } else {
        throw new Error(`
          not ok ${count} - ${msg}
            expected:
              ${expected}
            actual:
              ${actual} 
        `);
      }
      ++count;
    },
    same<T>(actual: any, expected: T, msg: string): void {
      if (Array.isArray(expected)) {
        for (const key of expected) {
          if (!actual.includes(key)) {
            throw new Error(`
              not ok ${count} - ${msg}
                expected:
                  ${JSON.stringify(expected)}
                actual:
                  ${JSON.stringify(actual)}
            `);
          }
        }
      } else if (isObject(expected)) {
        for(const [key, value] of Object.entries(expected)) {
          if (actual[key] !== value) {
            throw new Error(`
              not ok ${count} - ${msg}
                expected:
                  ${JSON.stringify(expected)}
                actual:
                  ${JSON.stringify(actual)}
            `);
          }
        }
      }
      console.log(`ok ${count} - ${msg}`);
      ++count;
    },
  });
};