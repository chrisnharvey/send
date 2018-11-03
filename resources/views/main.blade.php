<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link href="{{ mix('css/app.css') }}" rel="stylesheet">

        <title>Skygard Send</title>
    </head>
    <body>
        <div id="root"></div>
    </body>

    <script src="{{ mix('js/openpgp.min.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
</html>
