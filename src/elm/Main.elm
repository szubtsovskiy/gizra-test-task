module Main exposing (main)

import Browser exposing (Document)
import Html exposing (..)


type alias Model =
    { text : String
    }


type Msg
    = NoOp


main : Program () Model Msg
main =
    Browser.document
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init () =
    ( { text = ""
      }
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp ->
            ( model
            , Cmd.none
            )


view : Model -> Document Msg
view model =
    let
        body =
            [ textEditor
            ]
    in
    { title = "Gizra Test"
    , body = body
    }


textEditor : Html Msg
textEditor =
    Html.node "text-editor" [] []


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
