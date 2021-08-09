# hullblogs.com

> Aggregated posts from University of Hull students

This is an [Eleventy](https://11ty.dev/) powered website that aggregates RSS/Atom posts and presents them in reverse chronological order. It's purpose is to aggregate blog posts from current and past [University of Hull](https://www.hull.ac.uk/) students.

When it's live, you will be able to visit it here: <https://hullblogs.com/>.

To add your blog to the site, please follow the instructions below in the [add your site section](#add-your-site). You must be a current or past [University of Hull](https://hull.ac.uk) student in order to get your blog added.

Note that because this uses a static site generator, the content won't update automatically. The site must be rebuilt in order for new posts to show up.


## Add your blog
To add your blog, there are 2 ways you can do this - both of which are described below.


### I don't have any tecchnical knowledge


### I have some technical knowledge

If you are confident with editing JSON files to GitHub, you can update the `feeds.json` file in this repository, add a new entry like this to a random position (except the very bottom), and then [open a pull request](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request).

Here's an example new entry:

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


## But I don't have a blog!
Not to worry! It's easy to set one up, and a fabulous experience to have too. Not only is it useful for remembering things you've done in the past, but it's great on your CV too. Here are some places you can go to setup a free blog online with no hosting experience needed:

 - Wordpress: <https://wordpress.com/create-blog/>
 - Blogger: <https://www.blogger.com/about/>
 - Squarespace: <https://www.squarespace.com/websites/create-a-blog> (unclear as to whether it's free or not)
 - GitHub Pages: <https://pages.github.com/>

If you're looking for something to host yourself, these are great places to look:

 - Wordpress: <https://wordpress.org/>
 - TODO add more here


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

### Design Decisions
A number of decisions were made in the design process of this website. These are documented with the reasoning behind them here.

 - **Using a static site generator:** This greatly simplifies the website and the maintenance thereof.
 - **Not using a CSS framework (e.g. bootstrap):** CSS Grid and CSS flexbox are powerful enough such that a framework such as bootstrap is not needed. In addition, the HTML structure and overall project architecture is greatly simplified by avoiding such frameworks. The aim is ensure it is as simple as possible to understand and maintain.


## Contributing
Contributions are very welcome - both issues and pull requests! To add your blog to the site, please see the [add your blog section](#add-your-blog) above.


## License
hullblogs.com is released under the Apache Licence 2.0. The full license text is included in the `LICENSE` file in this repository. Tldr legal have a [great summary](https://tldrlegal.com/license/apache-license-2.0-(apache-2.0)) of the license if you're interested.
