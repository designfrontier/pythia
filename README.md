# pythia

*formerly known as foresight*

Outputs the emails for each person with >20% ownership of any file in your commit. Involving these owners in communication about changes to files they own has been shown to reduce the number of bugs in research done by microsoft.

For further reading see:
- https://www.microsoft.com/en-us/research/publication/the-influence-of-organizational-structure-on-software-quality-an-empirical-case-study/
- https://www.microsoft.com/en-us/research/publication/dont-touch-my-code-examining-the-effects-of-ownership-on-software-quality/

## usage
`npm i -g pythia`

Then you will have `pythia` as a command that you can run from your console!

## requesting reviewers

Adding `-p` or `--publish` to pythia will run the publish config and send the list
of reviewers to your code review system. It does this by calling `.pythia-publish`
passing it the email of the author, ownership percentage, and location of the file. 
You can write a `.pythia-publish` file to do whatever you need it to do for your 
review system.

As an example, for gerrit you might do something like this:

```
#! /bin/sh

ssh -p 29418 user@gerrit.bob.com gerrit set-reviewers -p my-project my-change-id-here -a $1
```

The three arguments are passed in a call that looks like:
```
./.pythia-publish daniel@some-website.com 93.25 somefile-path.md
```

So in bash that means
```
$1 = author's email
$2 = percentage of ownership
$3 = the file that is owned
```

Just to reiterate: `.pythia-publish` will be called once per author and the last
argument to it will be the author's email.

Also: the `.pythia-publish` file needs to be executable (`chmod +x .pythia-publish`)
and located in the root of your project (which is where you should call pythia from).

## config file

You can create a `.pythia-config` file in the root of your project in order to
exclude users, directories, or files from being processed and reported. This is
useful when people leave your team, or when you have files and directories that
are auto-generated.

The config file also allows you to change the threshold of ownership that adds
people to the review, and outputs their names. By default only users with 20% or
greater ownership of a file are output, and sent to yhe publish script. Now you
can change that to any number you would like (though >=20% is the number most
supported by the research).

The `.pythia-config` file should be a JSON formatted file and its contents should
look like this:

```
{
  "exclude": {
    "users": ["dsellers@example.com", "theOracle@example.com", "mreynolds@example.com"],
    "files": ["readme.md", "history.md", "AUTHORS"],
    "directories": ["bin"]
  },
  "threshold": 20
}
```

### command line argument

You may also pass the location of your config file ar runtime with the `--config`
option. This allows you to store your config in whatever file you would like. It
still needs to conform to the structure laid out above though.

As an example: `pythia --config pythia.json` where `pythia.json` is at the root
of your project.