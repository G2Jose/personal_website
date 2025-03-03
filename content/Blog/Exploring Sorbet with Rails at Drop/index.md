---
title: Exploring Sorbet with Rails at Drop
date: "2022-06-22"
---
#blog/post #ruby #ruby-on-rails #static-analysis

> [!note] 
> This is a shorter version of a more detailed post I made internally at Drop while researching this topic. Certain details have been removed here to protect confidentiality. 
> Based on this initial evaluation, Sorbet was adopted into the backend codebase initially on a trial run and more extensively afterwards.
# What is it?
[Sorbet](https://sorbet.org/) is a type checker for ruby built by Stripe. It aims to be for Ruby, what TypeScript is for JavaScript. 

It’s designed to be adopted gradually on existing code-bases. Sorbet can be used through code editors, where it can provide a more interactive, productive experience through smart auto-completion suggestions, go-to-definition and highlighted type errors. 

It can also be run through its CLI, and can be integrated into CI to catch errors before they’re merged and deployed.
# Who uses it?
Some notable companies using Sorbet include: 
- [Stripe](https://stripe.com/blog/sorbet-stripes-type-checker-for-ruby) (where it was originally built)
- [Shopify](https://shopify.engineering/adopting-sorbet)
- [Coinbase](https://sorbet.org/blog/2019/05/16/state-of-sorbet-spring-2019#open-sourcing-sorbet)
- [Kickstarter](https://www.codemancers.com/blog/2019-08-12-sorbet-type-checker-for-ruby/)
# Comparison to similar tools
[RBS](https://github.com/ruby/rbs) is a new syntax for representing types in ruby 3. While RBS aims to solve the same problem, it has a few notable differences with Sorbet:
- With RBS, types are represented in separate files, as opposed to annotations within the same file that sorbet supports (sorbet supports both annotations in separate .rbi files, and within regular .rb files).
    - I believe these will be much harder to maintain and keep in sync over time. This is not very different to how one could define types for JavaScript in separate `.d.ts` files - this wasn’t adopted by the community except for shipping type definitions for libraries written in JavaScript.
    - [Talk by Matz](https://youtu.be/IhTXDklRLME?t=741), where he talks about RBS and some reasons he wants them to be separate files (he just doesn’t seem to like the idea of type annotations)
- RBS is just a syntax for defining types. There isn’t an official type checking tool that comes with this, but is instead left to the community to build.
    - The main tool available here for type checking is [steep](https://github.com/soutaro/steep). It seems like its corresponding [editor extension (built for vscode)](https://github.com/soutaro/steep-vscode) hasn’t been updated in a long time. From a quick glance it doesn’t seem like there are companies backing this project.
- From some googling around, I couldn’t find any companies using RBS in production.
    - This is in stark contrast to Sorbet which is battle tested at places like Stripe and Shopify, both of who have built open source tooling around this.
- Some more info can be found here:
    - [Sorbet’s FAQ that talks about RBS](https://sorbet.org/docs/faq#when-ruby-3-gets-types-what-will-the-migration-plan-look-like)

Being a small engineering team at Drop, I think it’s important to bet on the right horse as we likely will not have the resources to build our own tooling around RBS.
# Sorbet @ Drop
## Current status
Sorbet has been set up on a branch named … [`sorbet`](https://github.com/earnwithdrop/drop/tree/sorbet). 

I’ve tried setting up sorbet both with and without [tapioca](https://github.com/Shopify/tapioca), and it appears that *sorbet* + *sorbet-rails* gives us the most coverage out of the box. 

This branch has also been set up with [spoom](https://github.com/Shopify/spoom), a handy tool built at Shopify that makes it easy to track gradual adoption. (this is what tells us that sorbet + sorbet-rails gives us better coverage than sorbet + tapioca)

Sorbet has been able to add types to a good chunk of our code-base without any manual effort. 58% of call sites are typed, and 43% of all files already have a type level of `true` or higher. 

> [!info]
> Redacted coverage report images

While sorbet also supports runtime checks, this has not been set up. Perhaps in the future it might make sense to enable this for QA. The *sorbet* branch contains no changes to runtime code, and only adds static checks.
## What might adopting it at Drop look like?
1. Get a proof of concept integration on a branch
2. Get other engineers to try it out and gather any initial feedback
3. Merge & extended canary. While there shouldn’t be any runtime code changes made here, it never hurts to be safe.
4. Integrate into CI, add pre-commit hooks to validate that existing typings aren’t broken. 
	- File level typing strictness has been set up on all files in a way that makes it so there are 0 type errors on current code. 
5. Set up tooling to measure adoption over time
	- To do this, the `srb` cli has [support for statsd](https://sorbet.org/docs/metrics). It should be possible to hook this up to DataDog, perhaps as a post-merge GitHub action.
6. Experimentation phase
	- Typing on new files will be optional during this period, allowing engineers to commit code with or without types (the expectation however will be that no existing types are broken). A dedicated sorbet slack channel will be set up to gather any feedback, address any issues or help folks ramp up during this phase. 
7. Depending on feedback from the above phase, align on future expectations across Backend Engineering. Examples of expectations we set may be:
    - All new code should meet a certain typing level
    - All touched code should meet a certain type level
    - Typing levels can only ever be incremented, never decremented

## Why might we want to adopt it?
The main reasons I see to adopt it are centered around the somewhat related themes of Developer Experience (DX), Productivity and Code Quality.
- Smart autocomplete suggestions as you type should make coding a more interactive, fun experience.
- Since these suggestions are based on methods, properties etc that actually exist (as opposed to auto-completion suggestions one might see from an editor in an untyped ruby code-base), it should provide an engineer with more confidence that the line of code they wrote will actually run, making it so one can write more code before having to run and test it. This should reduce the number of "*write code*" → "*run code*" → "*check that it works*" cycles one needs to perform, improving productivity.
- The interactivity it introduces here should also make it easier for new engineers to onboard onto the code-base. Type annotations should serve as machine validated documentation that’s always in sync.
- Type errors shown in one's editor should further quicken the feedback loop between writing code and knowing whether it'll run. Along with tests, types should bring in an added layer of safety, as realistically not all possible code branches may be covered by a test (note that this is in no way meant to replace or reduce the number of tests, but to work alongside them).
## FAQ on concerns one might have
- **Will this block me from being able to ship things?**
	Since sorbet is designed with incremental adoption in mind, it’s not likely that a type error will block anyone from shipping. A difficult to fix type error can always be suppressed by marking the file as `typed: false`, or using the `T.untyped` type. 
- **Will this mean the code-base will now be littered with types annotations?**
	**Not really. Sorbet is quite smart with type inference, unlike say, Java. Type annotations will be needed in places like method signatures, but sorbet will infer types in lots of other places.
    [See related info here](https://sorbet.org/docs/sigs#why-do-we-need-signatures). 
- **Does this mean I don't have to write as many tests?**
	Absolutely not - type checking and other forms of static analysis are meant to work on top of, not instead of, tests
# Crash Course on Sorbet
## Type levels
To allow for incremental adoption, sorbet supports various type levels on files. In increasing order of strictness they are: `ignore` → `false` → `true` → `strict` → `strong`
- `typed: ignore` files are not even read by sorbet
	As noted on the link below, if you un-ignore a file you must run  `srb rbi hidden-definitions`
- `typed: false` causes only syntax and constant resolution errors to be reported
- Any file marked `typed: true` or higher will report type errors
- `typed: strict` requires that all methods be explicitly annotated with types
- `typed: strong` we likely should not be using this since:
    
>[!warning]
Support for `typed: strong` files is minimal, as Sorbet changes regularly and new features often bring new `T.untyped` intermediate values.

To start getting value out of sorbet, files should be marked as `typed: true` or above. 

Sorbet can automatically scan files and suggest strictness on each file based on type errors that already exist through the `srb rbi suggest-typed` command. (this has already been done on the *sorbet* branch)

> [!tip]
📖 [You can read more about type levels here](https://sorbet.org/docs/static#file-level-granularity-strictness-levels).

Unless exceptional circumstances arise, we should aim to only increase our type level for any given file.
## Adding type annotations
### Typing methods
(Explicit types are required on methods due to how sorbet parallelizes type-checking for speed. [Read more here](https://sorbet.org/docs/sigs#why-do-we-need-signatures).)

- `extend T::Sig` at the top of the class / module
- Add `sig {params(param_name: ParamType).returns(ReturnType) }` above the method
- Add `require 'sorbet-runtime-stub' unless defined?(T)`

For example: 

```ruby
require 'sorbet-runtime-stub' unless defined?(T)

class CollectibleInventoryService
  extend T::Sig

	sig {params(amount: Integer).returns(T::Boolean)}
  def enough_available?(amount:)
		available >= amount
	end
end
```

Note that the syntax is the same whether parameters are named or positional. 

> [!tip]
📖 [You can read more about typing methods here](https://sorbet.org/docs/sigs).
### Typing non-methods

Often explicit type annotations are not required for local variables. Instead, their types can be inferred automatically. 

When explicit annotations are required though, `T.let` can be used. 

Example:

```ruby
collectible = T.let(user.collectible, Collectible) # Collectible is the type
```

> [!tip]
📖 [You can read more about typing non-method constructs here.](https://sorbet.org/docs/type-annotations)

### Other useful constructs

- `T.nilable` represents a union type with `nil`
    ```ruby
    c = T.let(user.collectible, T.nilable(Collectible))
    # c can be of type nil or Collectible 
    ```
    
- `T::Array` can be used to type arrays. It also supports generics, which can be used to restrict what objects can be contained in an array
    ```ruby
    x = T.let([], T::Array[String])
    x.push(1) # This should result in a type error
    ```
    
- `T::Hash` can be used in a similar way with generics
    ```ruby
    x = T.let({}, T::Hash[Symbol, Integer])
    x[:key] = 'string' # should result in an error
    ```
    
- `T.any` can be used to represent union types
    ```ruby
    T.any(String, Integer)
    ```
## Validating types

Type errors should appear in your editor as you write code (see [setup instructions above](Exploring%20Sorbet%20@%20Drop%2031390c998fcb49c290a89339944c3af2.md)), but type checking can also be done through the `srb tc` command. 
## Updating RBI

RBI may need to be updated if any of the following happens: 

1. A gem is upgraded or added
2. A file is changed that makes use of DSL (eg: a new association defined on a model)

To update RBI for gems, run the following command:

```bash
bundle exec rake sorbet:update:gems
```

To update all RBI, including RBI for gems, DSL and various other constructs, run the following command:

```bash
bundle exec rake sorbet:update:all
```

## Coming from Typescript?

[See this handy cheat-sheet](https://sorbet.org/docs/from-typescript).
# Resources
[Official site](https://sorbet.org/)
- 📚 **Blogs**
	- [Shopify: Adopting Sorbet at Scale](https://shopify.engineering/adopting-sorbet)
	- [Sorbet: Stripe’s type checker for Ruby](https://stripe.com/blog/sorbet-stripes-type-checker-for-ruby)
- 📹 **Talks**
	- [RubyConf 2019 Talk: Adopting Sorbet at Scale](https://www.youtube.com/watch?v=v9oYeSZGkUw)
- 🏘 **Community**
	- [Slack](https://sorbet-ruby.slack.com/)

# Related posts
```dataview
LIST WITHOUT ID "[["+file.name+"]]" + " " + dateformat(date, "yyyy MMM dd")
FROM #blog/post
WHERE contains(file.tags, "static-analysis") AND file.name != this.file.name
```
