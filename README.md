# hullblogs.com

> Aggregated posts from University of Hull students

This is an [Eleventy](https://11ty.dev/) powered website that aggregates RSS/Atom posts and presents them in reverse chronological order. It's purpose is to aggregate blog posts from current and past [University of Hull](https://www.hull.ac.uk/) students.

When it's live, you will be able to visit it here: <https://hullblogs.com/>.

To add your blog to the site, please follow the instructions below in the [add your site section](#add-your-site). You must be a current or past [University of Hull](https://hull.ac.uk) student in order to get your blog added.

Note that because this uses a static site generator, the content won't update automatically. The site must be rebuilt in order for new posts to show up.


## Add your site
To add your site, you need to update the `feeds.json` file in this repository, and add a new entry like this to a random position (except the bery bottom):

```json
{
	"author_name": "Your name here",
	"github_username": "your_github_username",
	"feed_uri": "https://example.com/feed/"
},
```

The 3 properties have the following meanings:

 - `author_name`: Your name. Shown beneath your posts.
 - `github_username`: Your GitHub username. Used for displaying your avatar.
 - `feed_uri`: The URL of your Atom or RSS feed.

Editing `feeds.json` is easy. You can even do it right in your web browser: <https://github.com/FreesideHull/hullblogs.com/edit/main/feeds.json>.


## Run your own instance
For development (and production, if you're in charge of the hullblogs.com website) purposes, it's sometimes useful to run your own instance of this website. These instructions wil have you up and running in no time!

## System (and user) Requirements
 - [Node.js](https://nodejs.org/)
 - A text editor (for editing `feeds.json`)
 - A web browser (we recommend [Firefox](https://firefox.com/))
 - Basic knowledge of the Linux Terminal (or Windows Command Line)

## Getting Started
First, clone this repository and `cd` into it:

```bash
git clone https://github.com/FreesideHull/hullblogs.com.git
cd hullblogs.com
```

Then, install the dependencies:

```bash
npm install
```

Now, you can build and serve the site locally:

```bash
npm start
```

It will take a moment to build, but then you'll get a message like this that shows the URL you can visit your local instance of the size:

![](https://imgur.com/VEUQMAB.png)


## Contributing
Contributions are very welcome - both issues and pull requests! To add your blog to the site, please see the [add your blog section](#add-your-blog) above.


## License
hullblogs.com is released under the Apache Licence 2.0. The full license text is included in the `LICENSE` file in this repository. Tldr legal have a [great summary](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)) of the license if you're interested.
