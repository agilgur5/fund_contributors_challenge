# fund_contributors_challenge

A challenge to create:

- A fund view where one can see all the contributors to the fund
- ability to add contributors
- ability to delete contributors

[View the Services](services/)

## Global Assumptions Made

There are more assumptions and rationale under each service, but here are some overall ones:

- The task is to build only one (1) screen that only lists one (1) fund with one (1) set of contributors and that there is no need to do any login or authentication of any sort
  - There might be another screen or modal for the form to add a contributor and perhaps a confirmation to delete a contributor
  - Given this assumption, one can further assume that the data structure:
    - Does not need to reference funds as there is only one
    - Does not need to reference specific contributions and amounts as they are not part of the task, just some extra details
- One can build the simplest version / proof-of-concept, not looking for "amount of features"
