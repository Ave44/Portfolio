# Wzorce projektowe

Opis wzorców zastosowanych w projekcie.

## Kreacyjne

- ### Fabryka

  Klasa `OrganismFactory` jest fabryką prostą i umożliwia tworze klas dziedziczących po klasie `Organism`. Zastosowanie tego wzorca ułatwia tworzenie organizmów podczas inicjalizacji świata oraz podczas wczytywania stanu świata z zapisu.

- ### Singleton
  Klasy `Window`, `TextureLoader` oraz `Renderer` są singletonami. Gwarantuje to że może istnieć tylko 1 instancja każdej z tych klas co pozwala uniknąć błędów (te klasy z założenia mają mieć tylko 1 instancję) oraz zapewnia to prosty dostęp do instancji tych klas.

## Strukturalne

- ### Fasada

  Klasy `Window`, `TextureLoader` oraz `Renderer` są fasadami do funkcjonalności oferowanej przez bibliotekę SDL. Zastosowanie tych klas dostarcza uproszczony interfejs do funkcjonalności z biblioteki SDL, po przez rozdzielenie logiki kodu od logiki wymaganej przez bibliotekę SDL, dzięki czemu kod jest znacznie czytelniejszy.

- ### Pyłek

  Klasa `TextureLoader` zawiera w sobie załadowane tekstury (`SDL_Texture`) z których korzystają pozostałe klasy. Dla przykładu każdy organizm potrzebuje swojej tekstury, ale wczytywanie tekstur z pamięci jest czasowo kosztowne, a dodatkowo z powodu że wiele organizmów posiada identyczną teksturę to przechowywalibyśmy wiele osobnych instancji tej samej tekstury w pamięci. Aby uniknąć tych problemów klasy zamiast pól przechowujących informacje o teksturach, posiadają pola ze wskaźnikami na tekstury, które przechowywane są w klasie `TextureLoader` w odpowiedniej mapie.

## Operacyjne (behawioralne)

- ### Mediator

  Klasa `World` implementuje wzorzec mediator. Odpowiada ona za komunikację między obiektami klasy `Organizm`, co ogranicza bezpośrednią komunikację między obiektami tej klasy, tym samym upraszczając ich implementację.

- ### Obserwator

  Klasa `LineageNode` implementuje wzorzec obserwator po przez obserwowanie klasy `Organism`. Klasa `Organism` przechowuje w sobie wskaźnik na instancję klasy `LineageNode` która ją obserwuje, i w przypadku zdarzenia istotnego dla klasy `LineageNode` (śmierć organizmu) informuje ją o tym.
