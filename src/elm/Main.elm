module Main exposing (main)

import Browser
import Document exposing (Document)
import Html exposing (..)
import Html.Attributes exposing (class)
import Html.Events exposing (on)
import Json.Decode as Decode


type alias Model =
    { document : Document
    }


type Msg
    = NoOp
    | DocumentChanged Document


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
    ( { document = Document.empty
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

        DocumentChanged doc ->
            ( { model | document = doc }
            , Cmd.none
            )


view : Model -> Html Msg
view model =
    let
        onDocumentChange tagger =
            on "document-change" (Decode.map tagger (Decode.field "detail" Document.decoder))

        viewParagraph t =
            p [] [ text t ]
    in
    div []
        [ textEditor [ class "text-editor", onDocumentChange DocumentChanged ] []
        , div [ class "extracted-text" ] (Document.mapParagraphs viewParagraph model.document)
        ]


textEditor : List (Attribute msg) -> List (Html msg) -> Html msg
textEditor =
    Html.node "text-editor"


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
