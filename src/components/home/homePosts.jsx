import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/utils/thunks";
import { Button, Spinner } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Masonry from "react-masonry-css";
import Moment from "react-moment";

const HomePosts = () => {
    const homePosts = useSelector((state) => state.posts)
    const dispatch = useDispatch();

    useEffect(() => {
        if (homePosts.articles.items.length <= 0) { //if there are no posts then we need to load it once. and this prevents it from triggering again and displaying more than 6 posts when we didn't click 'load more posts' (like if we go to 'contact' and then back to 'home' we won't be fetching more posts)
            dispatch(fetchPosts({ page: 1, order: "desc", limit: 6 }))
        }
    }, [])

    const loadMorePosts = () => {
        const page = homePosts.articles.page + 1;
        dispatch(fetchPosts({ page, order: "desc", limit: 6 }))
    }

    return (
        <>

            <Masonry
                breakpointCols={{ default: 3, 800: 2, 400: 1 }}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {homePosts.articles ?
                    homePosts.articles.items.map(item => (
                        <div key={item.id}>
                            <img style={{ width: '100%', height: '200px' }} src={`${item.image}?${item.id}`} alt="some pic" />
                            <div className="author">
                                <span>{item.author} - </span>
                                <Moment format="DD MMMM">{item.createdAt}</Moment>
                            </div>
                            <div className="content">
                                <div className="title">{item.title}</div>
                                <div className="excerpt">{item.excerpt}</div>
                                <LinkContainer to={`/article/${item.id}`} className="mt-3">
                                    <Button variant="light">Read more</Button>
                                </LinkContainer>
                            </div>
                        </div>
                    ))
                    : null}
            </Masonry>
            {homePosts.loading ? //we want to display an icon when loading more posts
            <div style={{textAlign:'center'}}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        :null}
            {!homePosts.articles.end && !homePosts.loading ?
                <Button variant="outline-dark" onClick={() => loadMorePosts()}>
                    load more post
                </Button>
                : null}
        </>
    )
}

export default HomePosts;