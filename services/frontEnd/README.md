# Front End

## Development

### Installation

```
npm install
```

### Using the Environment

Check out the [`package.json`](package.json) `scripts` section

## Assumptions Made

- Creative liberty to change some of the UI/UX, per email:
  - "no contributors" scenario and "add another contributor" scenario are actually identical
    - No need to have a special text link in the first as the same button works for both
  - "Name" instead of "First Name" and "Last Name"
    - Easier to type, less thought about the distinction, more inclusive
    - "Name" has a cut-off point for ellipsis so that each contributor takes up the same amount of space
      - Easier on the eyes, makes buttons appear in the same place instead of at varying heights, etc
  - Use an alternative to the "small x" for deletion
    - "small x" is not mobile-friendly and uncommon actions like deletion are better hidden under dropdowns
    - Used an "Options" dropdown with a "Remove Contributor" button under it instead
  - Pagination UI/UX was not specified
    - This can impact SEO, but we are ignoring that for this challenge
    - Used a Carousel component for pagination as it seems to fit the UI best
      - (other options might be just page numbers, infinite scrolling, a separate "More Details" page, etc)
  - Transitions, animations, loading, responsiveness, etc UI/UX were not specified
    - Made everything responsive (this did not take much extra effort)
    - There are some transitions here and there that are implemented by the component library I was using

## Rationale for approach

- Used [my own boilerplate](https://github.com/agilgur5/front-end-base) as a starting point
  - Using React, Webpack, Babel, etc as those are the libraries and tools I use (by far) most often and they can most definitely handle this type of problem / application well
    - My boilerplate doesn't yet have optimizations for PWAs, etc
    - I also added proxying support while doing this project
    - This was potentially simple enough that a framework might be a bit much, but there is enough dynamic data that I think it simplified a vanilla alternative
      - Since I have built many such projects it's also not particularly difficult for me to start another from scratch with my existing boilerplate
- Used `react-bootstrap` as a component library to simplify styling, forms, Modals, etc
  - Have also used it many times so easy for me to add it to a new project
- No need for a state management library as the state is fairly small & simple to keep track of
- In this specific case, I didn't actually include tests
  - Normally would add unit tests to the state management store, but there isn't a separate store in this case and the actions are simple
  - Since modern frameworks are all _declarative_, they are straightforward represenations of the state, so actions tend to be the most important to test
    - With the declarative style (as opposed to imperative), the usefulness of unit testing the views themselves is debatable
      - Snapshot testing seems to fit the declarative style a bit better, but I honestly haven't tried it yet so didn't want to experiment here
        - Would use `snapshot-diff` in that case
  - Normally would add E2E tests (with `cypress` or `puppeter` w/ `puppeteer-recorder`) to automate common manual tests of user workflows
    - In this case, there's only one real workflow that I was constantly developing against, so it didn't seem useful
  - Can add some tests if wanted
