# yt-dler

## APIS

- `/api` : Get video and audio links for the Youtube URL<br>
    Request Headers : 
    ```js
    {
        method: "GET",
        payload: {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    }
    ```
    Response sample :
    ```js
    {
        message: "",
        status: "ok",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        info: [...datas]
    }
    ```
- `/isvalid` : Check whether the URL is in youtube link format<br>
    Request Headers : 
    ```js
    {
        method: "GET",
        payload: {
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        }
    }
    ```
    Response sample : 
    ```js
    {
        message: "",
        status: "ok",
        isvalid: true
    }
    ```
## Other paths

- `/watch` : Play Youtube videos<br>Params : 
    ```js
    {
        v: "dQw4w9WgXcQ"    // Youtube video ID
    }
    ```
