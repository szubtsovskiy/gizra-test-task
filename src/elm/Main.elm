port module Main exposing (main)

import Browser
import Html exposing (..)
import Html.Attributes exposing (class)
import Json.Decode as Decode
import TextEditor


port docChanges : (Decode.Value -> msg) -> Sub msg


type alias Model =
    { paragraphs : List String
    }


type Msg
    = NoOp
    | TextChanged Decode.Value


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init () =
    ( { paragraphs = []
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

        TextChanged doc ->
            case Decode.decodeValue TextEditor.document doc of
                Ok paragraphs ->
                    ( { model | paragraphs = paragraphs }
                    , Cmd.none
                    )

                Err err ->
                    let
                        _ =
                            Debug.log "Oh snap!" err
                    in
                    ( model
                    , Cmd.none
                    )


view : Model -> Html Msg
view model =
    let
        viewParagraph t =
            p [] [ text t ]
    in
    div []
        [ textEditor [ class "text-editor" ] []
        , div [ class "extracted-text" ] (List.map viewParagraph model.paragraphs)
        ]


textEditor : List (Attribute msg) -> List (Html msg) -> Html msg
textEditor =
    Html.node "text-editor"


subscriptions : Model -> Sub Msg
subscriptions _ =
    docChanges TextChanged
