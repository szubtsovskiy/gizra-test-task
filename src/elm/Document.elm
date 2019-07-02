module Document exposing (Document, decoder, empty, mapParagraphs)

import Json.Decode
    exposing
        ( Decoder
        , Value
        , andThen
        , field
        , index
        , list
        , map
        , oneOf
        , string
        , succeed
        )


type alias Paragraph =
    String


type Document
    = Document (List Paragraph)


empty : Document
empty =
    Document []


decoder : Decoder Document
decoder =
    list paragraph
        |> map (List.filterMap identity)
        |> map Document


paragraph : Decoder (Maybe Paragraph)
paragraph =
    field "type" string
        |> andThen
            (\type_ ->
                case type_ of
                    "paragraph" ->
                        oneOf
                            [ map Just (field "content" (index 0 (field "text" string)))
                            , succeed Nothing
                            ]

                    _ ->
                        succeed Nothing
            )


mapParagraphs : (Paragraph -> a) -> Document -> List a
mapParagraphs f (Document paragraphs) =
    List.map f paragraphs
