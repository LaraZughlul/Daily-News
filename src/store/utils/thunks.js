import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//request to the server
const URL_SERV = 'http://localhost:3001'

export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async ({ page = 1, order = 'asc', limit = 10 }, { getState }) => { //the reason we have values here is so that we have default values, and if we pass arguments then it will override these values
        try {
            //http://localhost:3001/posts?_page=1&_limit=6&_order=desc&_sort=id >> we want to use params (after ?)
            //`${URL_SERV}/posts?_page=${page}&_limit=${limit}&_order=${order}&_sort=id`
            const response = await axios.get(`${URL_SERV}/posts?_page=${page}&_limit=${limit}&_order=${order}&_sort=id`)
            const prevState = getState().posts;

            return {
                items: [...prevState.articles.items, ...response.data],
                page: page,
                end: response.data.length === 0 ? true : false  //when there are no more posts (it returns an empty array) then it will be true, we will use this to hide the 'load more posts' button
            }

        } catch (error) {
            throw error
        }
    }
)

export const fetchPostById = createAsyncThunk(
    'posts/fetchPostById',
    async (id) => {
        try {
            const response = await axios.get(`${URL_SERV}/posts/${id}`)
            return response.data
        } catch (error) {
            throw error
        }
    }
)

export const addToNewsLetter = createAsyncThunk(
    'users/addToNewsLetter',
    async (data) => { //the data is the email of the user
        try {
            //check if the user is already on the database
            const findUser = await axios.get(`${URL_SERV}/newsletter?email=${data.email}`)

            if (!Array.isArray(findUser.data) || !findUser.data.length) { //if we don't find the email, we store it
                const response = await axios({
                    method: 'POST',
                    url: `${URL_SERV}/newsletter`,
                    data: { email: data.email }
                })

                return {
                    newsletter: 'added',
                    email: response.data
                }

            } else {
                return {
                    newsletter: 'failed'
                }
            }
        } catch (error) {
            throw error
        }
    }
)

export const sendMessage = createAsyncThunk(
    'users/sendMessage',
    async (data) => {
        try {
            await axios({
                method: 'POST',
                url: `${URL_SERV}/contact`,
                data
            })
            return true

        } catch (error) {
            throw error
        }
    }
)

