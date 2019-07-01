module TextEditor exposing (document)

import Json.Decode exposing (Decoder, Value, andThen, field, index, list, map, oneOf, string, succeed)


type alias Paragraph =
    String


type alias Document =
    List Paragraph


document : Decoder Document
document =
    list paragraph
        |> map (List.filterMap identity)


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
