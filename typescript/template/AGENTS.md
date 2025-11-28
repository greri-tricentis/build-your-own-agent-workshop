Keep answers succinct and concise

# Architecture
We are following Hexagonal Architecture a.k.a. Ports and Adapters, segrating Application from Infrastructure.

# CLI Usage
Avoid interactive commands
When running Git commands that may invoke a pager (e.g., diff, log, show, blame, reflog), always prefix with git --no-pager to disable paging
Use pnpm instead of npm for package management

To run the tests use the `test.sh` script.
```
./test.sh # run all tests
```