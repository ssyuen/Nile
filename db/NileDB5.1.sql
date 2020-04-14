INSERT INTO genre (`genre`)
VALUES ('Mystery');
INSERT INTO genre (`genre`)
VALUES ('Teen & Young Adult');
INSERT INTO genre (`genre`)
VALUES ('Classics');
INSERT INTO genre (`genre`)
VALUES ('Fiction');
INSERT INTO genre (`genre`)
VALUES ('Classic American');
INSERT INTO genre (`genre`)
VALUES ('International');

UPDATE genre
SET genre = 'Graphic Novel'
where genre = 'Graphic Novels';


INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9781451626650', 1, 7, 4, 'Catch-22: 50th Anniversary Edition (no Series)', 13.99, 96, 'NILE_CI_0024',
        'Anniversary edition', 'Simon & Schuster', '2011-04-05', 12, 'Joseph', 'Heller',
        'This fiftieth-anniversary edition commemorates Joseph Heller’s masterpiece with a new introduction; critical essays and reviews by Norman Mailer, Alfred Kazin, Anthony Burgess, and others; rare papers and photos; and much more.\r\n\r\nNominated as one of America’s best-loved novels by PBS’s The Great American Read.\r\n\r\nSoon to be a Hulu limited series starring Christopher Abbott, George Clooney, Kyle Chandler, and Hugh Laurie.\r\n\r\nFifty years after its original publication, Catch-22 remains a cornerstone of American literature and one of the funniest—and most celebrated—books of all time. In recent years it has been named to “best novels” lists by Time, Newsweek, the Modern Library, and the London Observer.\r\n\r\nSet in Italy during World War II, this is the story of the incomparable, malingering bombardier, Yossarian, a hero who is furious because thousands of people he has never met are trying to kill him. But his real problem is not the enemy—it is his own army, which keeps increasing the number of missions the men must fly to complete their service. Yet if Yossarian makes any attempt to excuse himself from the perilous missions he’s assigned, he’ll be in violation of Catch-22, a hilariously sinister bureaucratic rule: a man is considered insane if he willingly continues to fly dangerous combat missions, but if he makes a formal request to be removed from duty, he is proven sane and therefore ineligible to be relieved.\r\n\r\nThis fiftieth-anniversary edition commemorates Joseph Heller’s masterpiece with a new introduction by Christopher Buckley; a wealth of critical essays and reviews by Norman Mailer, Alfred Kazin, Anthony Burgess, and others; rare papers and photos from Joseph Heller’s personal archive; and much more. Here, at last, is the definitive edition of a classic of world literature.');


INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780762414741', 2, 8, 8, 'The 7 Habits Of Highly Effective Teens', 5.00, 293, 'NILE_CI_0019',
        'Updated Edition', 'Simon & Schuster', '2011-01-18', 15, 'Sean', 'Covey',
        'Over 3 million copies sold.\r\n\r\nOver 800 positive reviews.\r\n\r\nAdapted from the New York Times bestseller The 7 Habits of Highly Effective People, The 7 Habits of Highly Effective Teens is the ultimate teenage success guide—now updated for the digital age.\r\n\r\nImagine you had a roadmap—a step-by-step guide to help you get from where you are now, to where you want to be in the future. Your goals, your dreams, your plans…they’re all within reach. You just need the tools to help you get there.\r\n\r\nThat’s what Sean Covey’s landmark book, The 7 Habits of Highly Effective Teens, has been to millions of teens: a handbook to self-esteem and success. Now updated for the digital age, this classic book applies the timeless principles of 7 Habits to the tough issues and life-changing decisions teens face. Covey provides a simple approach to help teens improve self-image, build friendships, resist peer pressure, achieve their goals, and appreciate their parents, as well as tackle the new challenges of our time, like cyberbullying and social media. In addition, this book is stuffed with cartoons, clever ideas, great quotes, and incredible stories about real teens from all over the world.\r\n\r\nEndorsed by high-achievers such as former 49ers quarterback Steve Young and 28-time Olympic medalist Michael Phelps, The 7 Habits of Highly Effective Teens has become the last word on surviving and thriving as a teen.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780743273565', 1, 4, 4, 'The Great Gatsby', 8.50, 180, 'NILE_CI_0018', '', 'Scribner', '2004-08-30', 1000,
        'F. Scott', 'Fitzgerald',
        'The Great Gatsby, F. Scott Fitzgerald’s third book, stands as the supreme achievement of his career. First published in 1925, this quintessential novel of the Jazz Age has been acclaimed by generations of readers. The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan, of lavish parties on Long Island at a time when The New York Times noted “gin was the national drink and sex the national obsession,” it is an exquisitely crafted tale of America in the 1920s.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780679732761', 1, 2, 4, 'Invisible Man', 12.14, 581, 'NILE_CI_0026', '2nd edition', 'Vintage Books',
        '1995-01-01', 63, 'Ralph', 'Ellison',
        'A milestone in American literature--a book that has continued to engage readers since its appearance in 1952.\r\n\r\nNominated as one of America’s best-loved novels by PBS’s The Great American Read\r\n\r\n\r\nA first novel by an unknown writer, it remained on the bestseller list for sixteen weeks, won the National Book Award for fiction, and established Ralph Ellison as one of the key writers of the century. The nameless narrator of the novel describes growing up in a black community in the South, attending a Negro college from which he is expelled, moving to New York and becoming the chief spokesman of the Harlem branch of \"the Brotherhood\", and retreating amid violence and confusion to the basement lair of the Invisible Man he imagines himself to be. The book is a passionate and witty tour de force of style, strongly influenced by T.S. Eliot\'s The Waste Land, Joyce, and Dostoevsky.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780671894412', 1, 8, 4, 'All The President\'s Men', 1.00, 349, 'NILE_CI_0023', '2 Edition',
        'Simon & Schuster', '1994-06-16', 20, 'Bob', 'Woodward',
        'The full account of the Watergate scandal from the two Washington Post reporters who broke the story. This is “the work that brought down a presidency…perhaps the most influential piece of journalism in history” (Time, All-Time 100 Best Nonfiction Books).\r\n\r\nThis is the book that changed America. Published just two months before President Nixon’s resignation, All the President’s Men revealed the full scope of the Watergate scandal and introduced for the first time the mysterious “Deep Throat.” Beginning with the story of a simple burglary at Democratic headquarters and then continuing through headline after headline, Bernstein and Woodward deliver the stunning revelations and pieces in the Watergate puzzle that brought about Nixon\'s shocking downfall. Their explosive reports won a Pulitzer Prize for The Washington Post, toppled the president, and have since inspired generations of reporters.\r\n\r\nAll the President’s Men is a riveting detective story, capturing the exhilarating rush of the biggest presidential scandal in U.S. history as it unfolded in real time. It is, as former New York Times managing editor Gene Roberts has called it, “maybe the single greatest reporting effort of all time.”');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780545586177', 1, 6, 4, 'Catching Fire - The Hunger Games (book 2)', 8.14, 400, 'NILE_CI_0029',
        'Reprint edition', 'Scholastic Press', '2013-06-04', 125, 'Suzanne', 'Collins',
        'Suzanne Collins continues the amazing story of Katniss Everdeen in the phenomenal Hunger Games trilogy.\r\n\r\nAgainst all odds, Katniss Everdeen has won the annual Hunger Games with fellow district tribute Peeta Mellark. But it was a victory won by defiance of the Capitol and their harsh rules. Katniss and Peeta should be happy. After all, they have just won for themselves and their families a life of safety and plenty. But there are rumors of rebellion among the subjects, and Katniss and Peeta, to their horror, are the faces of that rebellion. The Capitol is angry. The Capitol wants revenge.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780439023528', 1, 6, 4, 'The Hunger Games (book 1)', 8.00, 384, 'NILE_CI_0028', 'Reprint edition',
        'Scholastic Press', '2010-07-03', 120, 'Suzanne', 'Collins',
        'In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. Long ago the districts waged war on the Capitol and were defeated. As part of the surrender terms, each district agreed to send one boy and one girl to appear in an annual televised event called, \"The Hunger Games,\" a fight to the death on live TV. Sixteen-year-old Katniss Everdeen, who lives alone with her mother and younger sister, regards it as a death sentence when she is forced to represent her district in the Games. The terrain, rules, and level of audience participation may change but one thing is constant: kill or be killed.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780385490818', 1, 6, 4, 'The Handmaid\'s Tale', 7.99, 311, 'NILE_CI_0022', '1st Anchor Books edition',
        'Anchor', '1998-03-16', 212, 'Margaret', 'Atwood',
        '#1 New York Times bestseller \r\n\r\nLook for The Testaments, the sequel to The Handmaid’s Tale, available now.\r\n \r\nAn instant classic and eerily prescient cultural phenomenon, from “the patron saint of feminist dystopian fiction” (New York Times). Now an award-winning Hulu series starring Elizabeth Moss.\r\n \r\nIn Margaret Atwood’s dystopian future, environmental disasters and declining birthrates have led to a Second American Civil War. The result is the rise of the Republic of Gilead, a totalitarian regime that enforces rigid social roles and enslaves the few remaining fertile women. Offred is one of these, a Handmaid bound to produce children for one of Gilead’s commanders. Deprived of her husband, her child, her freedom, and even her own name, Offred clings to her memories and her will to survive. At once a scathing satire, an ominous warning, and a tour de force of narrative suspense, The Handmaid’s Tale is a modern classic.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780375714573', 1, 9, 5, 'Persepolis: The Story Of A Childhood (pantheon Graphic Library)', 9.99, 160,
        'NILE_CI_0017', '1st Edition', 'Pantheon', '2004-06-01', 142, 'Marjane', 'Satrapi',
        'In powerful black-and-white comic strip images, Satrapi tells the story of her life in Tehran from ages six to fourteen, years that saw the overthrow of the Shah’s regime, the triumph of the Islamic Revolution, and the devastating effects of war with Iraq. The intelligent and outspoken only child of committed Marxists and the great-granddaughter of one of Iran’s last emperors, Marjane bears witness to a childhood uniquely entwined with the history of her country.\r\n\r\nPersepolis paints an unforgettable portrait of daily life in Iran and of the bewildering contradictions between home life and public life. Marjane’s child’s-eye view of dethroned emperors, state-sanctioned whippings, and heroes of the revolution allows us to learn as she does the history of this fascinating country and of her own extraordinary family. Intensely personal, profoundly political, and wholly original, Persepolis is at once a story of growing up and a reminder of the human cost of war and political repression. It shows how we carry on, with laughter and tears, in the face of absurdity. And, finally, it introduces us to an irresistible little girl with whom we cannot help but fall in love.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780316769174', 1, 18, 4, 'The Catcher In The Rye', 7.34, 288, 'NILE_CI_0027', 'Reissue edition',
        'Back Bay Books', '2001-01-30', 21, 'J.d.', 'Salinger',
        'Anyone who has read J.D. Salinger\'s New Yorker stories--particularly A Perfect Day for Bananafish, Uncle Wiggily in Connecticut, The Laughing Man, and For Esme With Love and Squalor--will not be surprised by the fact that his first novel is full of children. The hero-narrator of The Catcher in the Rye is an ancient child of sixteen, a native New Yorker named Holden Caulfield.\r\n\r\nThrough circumstances that tend to preclude adult, secondhand description, he leaves his prep school in Pennsylvania and goes underground in New York City for three days. The boy himself is at once too simple and too complex for us to make any final comment about him or his story. Perhaps the safest thing we can say about Holden is that he was born in the world not just strongly attracted to beauty but, almost, hopelessly impaled on it.\r\n\r\nThere are many voices in this novel: children\'s voices, adult voices, underground voices-but Holden\'s voice is the most eloquent of all. Transcending his own vernacular, yet remaining marvelously faithful to it, he issues a perfectly articulated cry of mixed pain and pleasure. However, like most lovers and clowns and poets of the higher orders, he keeps most of the pain to, and for, himself. The pleasure he gives away, or sets aside, with all his heart. It is there for the reader who can handle it to keep.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780312427566', 1, 8, 4, 'The Right Stuff', 10.59, 352, 'NILE_CI_0021', 'Revised Edition', 'Picador',
        '2008-03-04', 412, 'Tom', 'Wolfe',
        'From \"America\'s nerviest journalist\" (Newsweek)--a breath-taking epic, a magnificent adventure story, and an investigation into the true heroism and courage of the first Americans to conquer space. \"Tom Wolfe at his very best\" (The New York Times Book Review)\r\n\r\nMillions of words have poured forth about man\'s trip to the moon, but until now few people have had a sense of the most engrossing side of the adventure; namely, what went on in the minds of the astronauts themselves - in space, on the moon, and even during certain odysseys on earth. It is this, the inner life of the astronauts, that Tom Wolfe describes with his almost uncanny empathetic powers, that made The Right Stuff a classic.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780307743657', 1, 1, 4, 'The Shining', 5.78, 688, 'NILE_CI_0020', 'Reissue Edition', 'Anchor', '2012-06-26',
        500, 'Stephen', 'King',
        'Before Doctor Sleep, there was The Shining, a classic of modern American horror from the undisputed master, Stephen King.\r\n\r\nJack Torrance’s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he’ll have plenty of time to spend reconnecting with his family and working on his writing. But as the harsh winter weather sets in, the idyllic location feels ever more remote . . . and more sinister. And the only one to notice the strange and terrible forces gathering around the Overlook is Danny Torrance, a uniquely gifted five-year-old.');
INSERT INTO book (`ISBN`, `bindingID_book_FK`, `genreID_book_FK`, `typeID_book_FK`, `title`, `price`, `numPages`,
                  `nile_cover_ID`, `edition`, `publisher`, `publicationDate`, `stock`, `authorFirstName`,
                  `authorLastName`, `summary`)
VALUES ('9780061124952', 2, 12, 4, 'Charlotte\'s Web', 5.40, 192, 'NILE_CI_0025', 'Early edition', 'HarperCollins',
        '2012-04-10', 144, 'E.b.', 'White',
        'Don’t miss one of America’s top 100 most-loved novels, selected by PBS’s The Great American Read.\r\n\r\nThis beloved book by E. B. White, author of Stuart Little and The Trumpet of the Swan, is a classic of children\'s literature that is \"just about perfect.\" This paper-over-board edition includes a foreword by two-time Newbery winning author Kate DiCamillo.\r\n\r\nSome Pig. Humble. Radiant. These are the words in Charlotte\'s Web, high up in Zuckerman\'s barn. Charlotte\'s spiderweb tells of her feelings for a little pig named Wilbur, who simply wants a friend. They also express the love of a girl named Fern, who saved Wilbur\'s life when he was born the runt of his litter.\r\n\r\nE. B. White\'s Newbery Honor Book is a tender novel of friendship, love, life, and death that will continue to be enjoyed by generations to come. It contains illustrations by Garth Williams, the acclaimed illustrator of E. B. White\'s Stuart Little and Laura Ingalls Wilder\'s Little House series, among many other books.');