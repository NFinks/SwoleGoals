import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github-stats/github.service';
import { GithubFactory, SwoleGoalsFactory, Account, Vivian, Kaibo, Nick, Nicole, Rohan, Michael } from './GithubFactory';


@Component({
	selector: 'app-github-stats',
	templateUrl: './github-stats.component.html',
	styleUrls: ['./github-stats.component.css']
})
export class GithubStatsComponent implements OnInit {
  public factory: GithubFactory = new SwoleGoalsFactory();
  public gitAccountList = [
  {
    user: 'vivianmnguyen',
    url: 'https://github.com/vivianmnguyen',
    commits: '0',
    name: 'Vivian Nguyen',
    bio: 'Vivian is an ECE Major graduating in December of 2019',
    image: '../../assets/headshots/vivian.jpg',
    responsibilities: "Initialize CloudSQL database. Load web-scraped exercise data into database. " +
    "Write notes for local database development. " +
    "Write a script for automatically loading web-scraped text files. Phase 2: "
  },
  {
    user: 'KaiboCai',
    url: 'https://github.com/KaiboCai',
    commits: '0',
    name: 'Kaibo Cai',
    bio: 'Kaibo is an ECE Major graduating in December of 2019',
    image: '../../assets/headshots/kaibo.jpg',
    responsibilities: "Set up the backend server using nodejs.  " +
    "Connect the backend server with glcoud sql database. " +
    "Create two Get request routers. Create user table in the database. Phase 2: Set up google firestore server, wrote routes for frontend post querying. Helped build login function and user profile page. Phase 3: Added and modified routers for firestore and sql server to ensure front end functionalities. Help with setting up challenge group reference function on front end and firestore server. Help re-setting the dataservice inside the Angular framework."
  },
  {
    user: 'NFinks',
    url: 'https://github.com/NFinks',
    commits: '0',
    name: 'Nicole Finks',
    bio: 'Nicole is an ECE Major graduating in December of 2019',
    image: '../../assets/headshots/nicole.jpg',
    responsibilities: "Create profile page using Bootstrap 4. Create basic aesthetic design to be " +
    "used throughout front end. Standardization of css files. " +
    "Correction of general front-end functionality errors. Phase 2:. Phase 3: "
  },
  {
    user: 'prilak',
    url: 'https://github.com/prilak',
    commits: '0',
    name: 'Michael Lawrence',
    bio: 'Michael is an ECE Major graduating in May of 2019',
    image: '../../assets/headshots/michael.jpg',
    responsibilities: "Create map page and exercise list page. " +
    "Add issue information on the about page. Work on initializing the scraping script. Phase 2: Added filters and on click functionality to exercise list page. Created the exercise table page. Fixed issue with missing git commits. Fixed the exercise list table duplicates issue. Added tests for the sql database. Phase 3: Finalized format for performance table, Game Map, Exercise Result, Current Exercise. Added exercise selection and results initialization functionality to Game Map. Created Game Map, Exercise Result, and Current Exercise page. Established connection for entering user results on the frontend."
  },
  {
    user: 'NickPattie',
    url: 'https://github.com/NickPattie',
    commits: '0',
    name: 'Nick Pattie',
    bio: 'Nick is a BME Major graduating in May of 2019',
    image: '../../assets/headshots/nick.png',
    responsibilities: "Write Python script for webscraping on Bodybuilding.com utilizing selenium. " +
    "Create test file for web scraping. " +
    "Provide and load in exersise data into MySQL database. Phase 2: Created challenge creation page and saving the challenges in the new firebase datastore. Phase 3: Connected challenge creation to the backend and the rest of the components. Made the leaderboard component. Helped fix/make various http post and get requests to share information between the different components."
  },
  {
    user: 'rkoripalli',
    url: 'https://github.com/rkoripalli',
    commits: '0',
    name: 'Rohan Koripalli',
    bio: 'Rohan is an ECE Major graduating in December of 2019',
    image: '../../assets/headshots/rohan.png',
    responsibilities: "Create angular project. Setup Bootstrap. Build Splash page and About page " +
    "using Github API. Setup routing between Angular components. Phase 2: Moved frontend to AWS. Added Travis CI for testing and automatic deployment to AWS. Setup Angular build and production environments. Worked on the user profile page and new group creation, helped with backend server for Firestore. Phase 3: Created User and Group services for getting data from backend to allow for a centralized location to get this data from different components. Updated UI for consistency across pages. Created Postman tests for backend servers."
  }];
	public totalCommits = 0;
	public issues;
	public commits = [];
	constructor(private githubserv: GithubService) { }

	ngOnInit() {
		this.loadGithubRepos();
		this.loadGithubIssues();
	}
	public loadGithubIssues() {
		this.githubserv.getIssues().subscribe((data) => {
			this.issues = data;
		});
	}
	public loadService(page) {
		var urlString = `https://api.github.com/repositories/168768624/commits?page=`;
		this.githubserv.getUserCommits(urlString, page).subscribe(item => {
			var cs = item as Array<any>;

			if (cs.length != null && cs.length > 0) {
				cs.forEach(commit => { this.commits.push(commit) });
				this.loadService(++page);
			}

			else {//done
				var commitCounts = [0, 0, 0, 0, 0, 0];

				this.commits.forEach(commit => {
					var user = 'rkoripalli';
					if (commit.author != null)
						user = commit.author.login;
					if (user === "vivianmnguyen") {
						commitCounts[0]++;
					}
					if (user === "KaiboCai") {
						commitCounts[1]++;
					}
					if (user === "NFinks") {
						commitCounts[2]++;
					}
					if (user === "prilak") {
						commitCounts[3]++;
					}
					if (user === "NickPattie") {
						commitCounts[4]++;
					}
					if (user === "rkoripalli") {
						commitCounts[5]++;
					}
				});
				this.gitAccountList[0].commits = commitCounts[0].toString();
				this.gitAccountList[1].commits = commitCounts[1].toString();
				this.gitAccountList[2].commits = commitCounts[2].toString();
				this.gitAccountList[3].commits = commitCounts[3].toString();
				this.gitAccountList[4].commits = commitCounts[4].toString();
				this.gitAccountList[5].commits = commitCounts[5].toString();
				this.totalCommits = 0;
				commitCounts.forEach(count => this.totalCommits += count);
			}

		});
	}
	public loadGithubRepos() {
		this.loadService(1);
	}
}
