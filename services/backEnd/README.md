# Back End

## Development

### Installation

```
npm install
```

### Using the Environment

Check out the [`package.json`](package.json) `scripts` section

## Assumptions Made

- File Uploads/Downloads aren't completely specified
  - Per global assumption, simplest way is to just store on the back-end server itself and have it serve the files, so I did that
    - This of course is not really stateless
    - Does not scale to multiple servers (each must be able to access or reference the data) or large sizes (too big for one disk)
      - Would also be volatile if not placed on an external volume when deployed
  - Best practice is to store on a blob server like S3 and serve via CDN (or store on CDN directly)
    - One may also limit the types of files, size of files, do image compression or optimization, and perhaps expire the files by a certain date
    - Using signed direct uploads would be preferable, and signed downloads is likely not necessary in this case, but depends on the permissions warranted (public or something else)
    - Same best practice for assets
    - Intermediary might be to serve via an optimized webserver (e.g. NGINX) instead of the app server itself
    - These all of course require more configuration and complexity
- Data source was not specified and neither was resiliency, scaling capability, etc
  - Per global assumption, simplest way is to not care at all about those and store everything on one server on its disk or in its memory, which is what I did
    - Similarly _not_ stateless
    - Data is ephemeral & volatile, and when the process exits (for whatever reason) the data is lost
  - Best practice would be to store in an independent separate central database server which is replicated and backed-up / snapshotted
    - That would allow multiple stateless servers to access the same data concurrently and the two services to scale independently
    - Intermediary would be to store data to disk as well (e.g. a write-ahead log, SQLite, etc) so it's at least recovered on restarts
    - Similarly require more configuration and complexity, as well as set-up requirements (e.g. the schema)
- REST was required, but per global assumption, only _one_ resource (contributors) was required
  - Otherwise, including funds and contributions resources might make for quite a bit of batching and inefficiency (where GraphQL or an ad-hoc API might be better served)

## Rationale for approach

- I used a Node w/ Express server as its pretty bare-bones without any middleware and one doesn't need much for this challenge
  - Could certainly have used Flask/Sanic or other such tiny servers too without much difference
    - Something like Django or Rails seemed overkill for this
  - Using the same language across the stack is a bit simpler too
  - Node tends to have better tooling for things like SSR and GraphQL, though those weren't used and REST was required
  - Node also has great cross-platform support, so I don't really need to add Docker (and don't need Docker for the database as there is no database)
- Per the assumptions above, I stored the data in-memory in an array and files on disk in a gitignore'd folder
  - This is the simplest way to do it, but does not at all scale as per the assumptions section
  - Chose an array for optimized O(1) retrieval as it's the most frequent request, but deletion is O(n)
    - This is because a `path` search is required to avoid the race condition one would have when querying on `index`
    - Dictionary-type structure would have the opposite performance. It would need to be ordered for get (e.g. `Map()`)
    - Could use an in-memory B+ tree like a SQL DB, but that would too add complexity
- 3 API endpoints were required for the scenario and they fit a REST spec well (GET, POST, & DELETE)
- I opted not to use any validation library (e.g. `joi`) as it probably wasn't needed and I only did some simple validation
  - That being said, I think it would've been useful as type-coercion and other similar bugs were hard to spot (welp)
- I used `ava` for testing as I prefer the simplicity and explicitness of the `tape`/`tap`-like syntax
  - Global usage of other tools I particularly don't like (makes it hard to run through a debugger, isn't explicit, etc)
  - `ava` has advantages on top of `tape` like watching and concurrency support out-of-the-box, etc (also less buggy than `tape-watch`, etc)
- I used `supertest-fetch` for making requests to the server while testing because the experience is very similar to native browser requests
  - I did in fact copy+paste some of the code into the front-end after the API was ready
