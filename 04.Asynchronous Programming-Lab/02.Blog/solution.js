function attachEvents(){
    const appKey = "kid_Sk4pPo_dN";
    const serviceUrl = "https://baas.kinvey.com/appdata/" + appKey;
    const username = "peter";
    const password = "p";
    const base64Auth = btoa(username + ":" + password);
    const authHeaders = { "Authorization": "Basic " + base64Auth };

    let postsContainer = $('#posts');

    $('#btnLoadPosts').click(loadPosts);
    $('#btnViewPost').click(viewPost);

    function loadPosts() {
        let loadPostsRequest = {
            method:"GET",
            url: serviceUrl + "/posts",
            headers: authHeaders,
        };
        $.ajax(loadPostsRequest)
            .then(displayPosts)
            .catch(displayError);
    }

    function displayPosts(posts) {
        $("#posts").empty();
        for (let post of posts) {
            let option = $("<option>").text(post.title).val(post._id);
            $("#posts").append(option);
        }
    }

    function viewPost() {
        let selectedPostId = $("#posts").val();
        if (!selectedPostId) return;
        let requestPost = $.ajax({
            method:"GET",
            url: serviceUrl + "/posts/" + selectedPostId,
            headers: authHeaders
        });
        let requestComments = $.ajax({
            method:"GET",
            url: serviceUrl + `/comments/?query={"post_id":"${selectedPostId}"}`,
            headers: authHeaders
        });
        Promise.all([requestPost, requestComments])
            .then(displayPostWithComments)
            .catch(displayError);
    }

    function displayPostWithComments([post, comments]) {
        $("#post-title").text(post.title);
        $("#post-body").text(post.body);
        $("#post-comments").empty();
        for (let comment of comments) {
            let commentItem = $("<li>")
                .text(comment.text);
            $("#post-comments")
                .append(commentItem);
        }
    }

    function displayError(err) {
        let errorDiv = $("<div>").text("Error: " +
            err.status + ' (' + err.statusText + ')');
        $(document.body).prepend(errorDiv);
        setTimeout(function () {
            $(errorDiv).fadeOut(function () {
                $(errorDiv).remove();
            });
        }, 3000);
    }
};