# Gamepad FRMI API

## User

### /user/signup (POST)

Create a new user

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |
| `username` | string | Yes      |

<br>
<br>

### /user/login (POST)

Log a user

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

<br>
<br>
<br>

## Reviews

### /user/postreview (POST)

Create a new review

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `title`    | string | Yes      |
| `text`     | string | Yes      |
| `author`   | string | Yes      |
| `username` | string | Yes      |

<br>
<br>

### /user/getreview (GET)

Get a review

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `gameId`    | string | Yes     |

<br>
<br>
<br>

## Favoris

### /user/postfavoris (POST)

Add a favori

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `userId`   | string | Yes      |
| `gameId`   | string | Yes      |

<br>
<br>

### /user/getfavoris (GET)

Get favoris

| Body       | Type   | Required |
| ---------- | ------ | -------- |
| `userId`   | string | Yes      |
| `gameId`   | string | Yes      |

<br>
<br>
<br>
