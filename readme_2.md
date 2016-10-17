[![wercker status](https://app.wercker.com/status/787835327a70d7e077d288fd9fa77d09/s/master "wercker status")](https://app.wercker.com/project/bykey/787835327a70d7e077d288fd9fa77d09)

# c0 Landing Page Website

This repository contains the source for the [c0.pezapp.io](http://c0.pezapp.io)
community site.


## Building

This website is built using the awesome [Hugo static website generator tool]
(https://gohugo.io/). Before beginning you need to install Hugo for your
platform and ensure Hugo is in your PATH.

Hugo not only compiles the source into a static website, but it also can serve
up the content to speed up development. To compile and serve:

```
hugo server
```

This will output similar to this:

```
[~/c0-landingpage]$ hugo server
0 draft content
0 future content
5 pages created
0 paginator pages created
0 tags created
0 categories created
in 37 ms
Watching for changes in /Users/sneal/c0-landingpage/{data,content,layouts,static,themes}
Serving pages from memory
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1)
Press Ctrl+C to stop
```

Open the website from the URL given in the output, which in the example above
is http://localhost:1313/.

The compiled Hugo website that is being served is in the `public` directory
under the root of the repo and is never committed into git. An automated
Wercker build handles compiling and pushing the compiled output to Cloud Foundry
for hosting from the master branch.


## Contributing

To contribute to this website with new documentation or fixes:

1. Fork this repository
2. Create a branch off of master
3. Make your changes and commit them
4. Push your branch
5. Submit a PR
