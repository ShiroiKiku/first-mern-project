import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom' 
import { LinksPage } from './page/LinksPage'
import { CreatePage } from './page/CreatePage'
import { DetailPage } from './page/DetailPage'
import { AuthPage } from './page/AuthPage'
export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/links" exact>
                    <LinksPage/>
                </Route>
                <Route path="/create" exact>
                    <CreatePage/>
                </Route>
                <Route path="/detail:id" >
                    <DetailPage/>
                </Route>
                <Redirect to="/create"/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact >
                <AuthPage/>
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}